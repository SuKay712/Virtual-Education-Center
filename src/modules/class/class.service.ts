import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class, Course, Lecture, Account } from '../../entities';
import { addDays, addWeeks, setHours, setMinutes, isWithinInterval, setSeconds, setMilliseconds, nextMonday } from 'date-fns';

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
      const existingStart = new Date(existingClass.time_start);
      const existingEnd = new Date(existingClass.time_end);

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
        // Start from next Monday and add the appropriate number of days
        const daysToAdd = (dayOfWeek - 1 + 7) % 7; // Convert to 0-based (Monday = 0)
        const classDate = addDays(nextMondayDate, daysToAdd + (weekOffset * 7));

        // Set time for the class and reset seconds and milliseconds
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
}
