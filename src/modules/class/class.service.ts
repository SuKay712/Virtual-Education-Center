import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class, Course, Lecture, Account, Booking } from '../../entities';
import { addDays, addWeeks, setHours, setMinutes, isWithinInterval, setSeconds, setMilliseconds, nextMonday } from 'date-fns';
import { UpdateClassDto } from './dtos/update-class.dto';
import { UpdateClassRatingDto } from './dtos/update-class-rating.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  private async hasTimeConflict(
    studentId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const existingClasses = await this.classRepository.find({
      where: { student: { id: studentId } },
      relations: ['student'],
    });

    return existingClasses.some(existingClass => {
      // Parse time strings
      const parseTimeString = (timeStr: string | Date) => {
        if (timeStr instanceof Date) {
          return timeStr;
        }
        const [time, date] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
        const [day, month, year] = date.split('/');
        return new Date(
          parseInt(year),
          parseInt(month) - 1, // Month is 0-based in JavaScript
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
      };

      const existingStart = parseTimeString(existingClass.time_start);
      const existingEnd = parseTimeString(existingClass.time_end);

      // Reset seconds and milliseconds for comparison
      const cleanExistingStart = setMilliseconds(setSeconds(existingStart, 0), 0);
      const cleanExistingEnd = setMilliseconds(setSeconds(existingEnd, 0), 0);
      const cleanStartTime = setMilliseconds(setSeconds(startTime, 0), 0);
      const cleanEndTime = setMilliseconds(setSeconds(endTime, 0), 0);

      // Check if the new class time overlaps with any existing class
      return (
        isWithinInterval(cleanStartTime, { start: cleanExistingStart, end: cleanExistingEnd }) ||
        isWithinInterval(cleanEndTime, { start: cleanExistingStart, end: cleanExistingEnd }) ||
        isWithinInterval(cleanExistingStart, { start: cleanStartTime, end: cleanEndTime })
      );
    });
  }

  async createClassesForCourse(
    courseId: number,
    studentId: number,
    timeStart: string,
    timeEnd: string,
    daysOfWeek: number[],
  ): Promise<Class[]> {
    // Get course with lectures
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['lectures'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Get student
    const student = await this.accountRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const classes: Class[] = [];
    const [startHour, startMinute] = timeStart.split(':').map(Number);
    const [endHour, endMinute] = timeEnd.split(':').map(Number);

    // Sort days of week to ensure consistent ordering
    const sortedDaysOfWeek = [...daysOfWeek].sort((a, b) => a - b);

    // Calculate how many classes per day
    const totalLectures = course.lectures.length;
    const daysCount = sortedDaysOfWeek.length;
    const classesPerDay = Math.ceil(totalLectures / daysCount);

    let lectureIndex = 0;
    let weekOffset = 0;

    // Get next Monday as the starting point
    const nextMondayDate = nextMonday(new Date());

    // Create classes for each lecture
    while (lectureIndex < totalLectures) {
      for (const dayOfWeek of sortedDaysOfWeek) {
        if (lectureIndex >= totalLectures) break;

        const lecture = course.lectures[lectureIndex];

        // Calculate class date based on day of week and week number
        const daysToAdd = (dayOfWeek - 1 + 7) % 7; // Convert to 0-based (Monday = 0)
        const classDate = addDays(nextMondayDate, daysToAdd + (weekOffset * 7));

        // Set time for the class
        const [startHour, startMinute] = timeStart.split(':').map(Number);
        const [endHour, endMinute] = timeEnd.split(':').map(Number);

        const classStartTime = setMilliseconds(
          setSeconds(
            setMinutes(setHours(classDate, startHour), startMinute),
            0
          ),
          0
        );
        const classEndTime = setMilliseconds(
          setSeconds(
            setMinutes(setHours(classDate, endHour), endMinute),
            0
          ),
          0
        );

        // Check for time conflicts
        const hasConflict = await this.hasTimeConflict(studentId, classStartTime, classEndTime);
        if (hasConflict) {
          throw new BadRequestException(
            `Cannot create class: Student already has a class scheduled at this time (${timeStart}-${timeEnd} on day ${dayOfWeek})`
          );
        }

        const classEntity = this.classRepository.create({
          lecture,
          student,
          time_start: classStartTime,
          time_end: classEndTime,
        });

        classes.push(classEntity);
        lectureIndex++;
      }
      weekOffset++;
    }

    return this.classRepository.save(classes);
  }

  async getAllClassesWithBookings() {
    return this.classRepository.find({
      relations: [
        'lecture',
        'lecture.course',
        'student',
        'bookings',
        'bookings.teacher',
        'meeting'
      ],
      order: {
        time_start: 'DESC'
      }
    });
  }

  private parseTime(timeStr: string): Date {
    const [time, date] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    const [day, month, year] = date.split('/');
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
  }

  async updateClass(classId: number, updateClassDto: UpdateClassDto): Promise<Class> {
    // Find the class with its relations
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['student', 'bookings', 'bookings.teacher', 'lecture'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Update time if provided
    if (updateClassDto.time_start || updateClassDto.time_end) {
      const newStart = updateClassDto.time_start ? this.parseTime(updateClassDto.time_start) : new Date(classEntity.time_start);
      const newEnd = updateClassDto.time_end ? this.parseTime(updateClassDto.time_end) : new Date(classEntity.time_end);

      // Validate time range
      if (newStart >= newEnd) {
        throw new BadRequestException('Time start must be less than time end');
      }

      classEntity.time_start = newStart;
      classEntity.time_end = newEnd;

      // Tạo thông báo cho student khi thời gian thay đổi
      const notification = await this.notificationService.createNotification(
        classEntity.student.id,
        `Thời gian lớp học "${classEntity.lecture.name}" đã được cập nhật thành ${newStart.toLocaleString()} - ${newEnd.toLocaleString()}`
      );
      this.notificationGateway.sendNotificationToUser(classEntity.student.id, notification.content);
    }

    // Add new bookings if teacherIds are provided
    if (updateClassDto.teacherIds && updateClassDto.teacherIds.length > 0) {
      // Get all teachers
      const teachers = await this.accountRepository.findBy({
        id: In(updateClassDto.teacherIds)
      });

      if (teachers.length !== updateClassDto.teacherIds.length) {
        throw new NotFoundException('One or more teachers not found');
      }

      // Check for existing bookings
      const existingTeacherIds = classEntity.bookings.map(booking => booking.teacher.id);
      const duplicateTeacherIds = updateClassDto.teacherIds.filter(id => existingTeacherIds.includes(id));

      if (duplicateTeacherIds.length > 0) {
        throw new BadRequestException(
          `Teachers with IDs [${duplicateTeacherIds.join(', ')}] already have bookings for this class`
        );
      }

      // Create bookings for each teacher
      const bookings = teachers.map(teacher =>
        this.bookingRepository.create({
          classEntity: classEntity,
          teacher,
          status: 0,
          payment: false,
        })
      );

      const savedBookings = await this.bookingRepository.save(bookings);

      // Tạo thông báo cho mỗi giáo viên mới
      for (const booking of savedBookings) {
        const notification = await this.notificationService.createNotification(
          booking.teacher.id,
          `Bạn vừa được thêm vào lớp học: ${classEntity.lecture.name}`
        );
        this.notificationGateway.sendNotificationToUser(booking.teacher.id, notification.content);
      }

      // Add the new bookings to the class's bookings array
      classEntity.bookings = [...classEntity.bookings, ...savedBookings];
    }

    // Save the updated class with its new bookings
    const updatedClass = await this.classRepository.save(classEntity);

    // Return the class with all its relations
    return this.classRepository.findOne({
      where: { id: updatedClass.id },
      relations: ['student', 'bookings', 'bookings.teacher', 'lecture', 'lecture.course'],
    });
  }

  async updateClassRating(classId: number, teacherId: number, updateDto: UpdateClassRatingDto): Promise<Class> {
    // Find the class with its relations
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['bookings', 'bookings.teacher'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Check if the teacher is assigned to this class
    const teacherBooking = classEntity.bookings.find(booking =>
      booking.teacher.id === teacherId && booking.status === 1
    );

    if (!teacherBooking) {
      throw new ForbiddenException('You are not authorized to rate this class');
    }

    // Check if the class has ended
    const classEndTime = new Date(classEntity.time_end);
    const currentTime = new Date();

    if (classEndTime > currentTime) {
      throw new BadRequestException('Cannot rate a class that has not ended yet');
    }

    // Update rating and comment
    classEntity.rating = updateDto.rating;
    classEntity.comment = updateDto.comment;

    return this.classRepository.save(classEntity);
  }
}
