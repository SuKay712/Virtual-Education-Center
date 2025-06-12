import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, LessThan } from 'typeorm';
import { Booking, Account, Class } from '../../entities';
import { UpdateBookingStatusDto } from './dtos/update-booking-status.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { NotificationService } from '../notification/notification.service';
import { FreeTimeService } from '../free-time/free-time.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    private readonly notificationService: NotificationService,
    private readonly freeTimeService: FreeTimeService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking[]> {
    // Find the class
    const classEntity = await this.classRepo.findOne({
      where: { id: createBookingDto.classId },
      relations: ['bookings', 'bookings.teacher', 'lecture'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    // Find all teachers
    const teachers = await this.accountRepo.findBy({
      id: In(createBookingDto.teacherIds)
    });

    if (teachers.length !== createBookingDto.teacherIds.length) {
      throw new NotFoundException('One or more teachers not found');
    }

    // Check for existing bookings
    const existingTeacherIds = classEntity.bookings.map(booking => booking.teacher.id);
    const duplicateTeacherIds = createBookingDto.teacherIds.filter(id => existingTeacherIds.includes(id));

    if (duplicateTeacherIds.length > 0) {
      throw new BadRequestException(
        `Teachers with IDs [${duplicateTeacherIds.join(', ')}] already have bookings for this class`
      );
    }

    // Create bookings for each teacher
    const bookings = teachers.map(teacher =>
      this.bookingRepo.create({
        classEntity,
        teacher,
        status: 0,
        payment: false,
      })
    );
    const savedBookings = await this.bookingRepo.save(bookings);

    // Create notifications for each teacher
    for (const booking of savedBookings) {
      const notification = await this.notificationService.createNotification(
        booking.teacher.id,
        `Bạn vừa được tạo booking cho lớp học: ${classEntity.lecture.name} tại ${classEntity.time_start}`
      );

      console.log(notification);
      // Gửi thông báo realtime qua WebSocket
      this.notificationGateway.sendNotificationToUser(booking.teacher.id, notification.content);
    }

    return savedBookings;
  }

  async updateBookingStatus(bookingId: number, updateDto: UpdateBookingStatusDto, currentAccountId): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['teacher', 'classEntity', 'classEntity.student', 'classEntity.bookings.teacher', 'classEntity.lecture'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 0) {
      throw new BadRequestException('Booking has already been processed');
    }

    if (updateDto.status === 1) {
      const hasAcceptedBooking = booking.classEntity.bookings.some(
        (b) => b.id !== bookingId && b.status === 1
      );

      if (hasAcceptedBooking) {
        throw new BadRequestException('This class already has an accepted booking');
      }

      // Kiểm tra giáo viên đã có booking accepted nào trùng giờ chưa
      const teacherAcceptedBookings = await this.bookingRepo.find({
        where: {
          teacher: { id: booking.teacher.id },
          status: 1, // đã accept
        },
        relations: ['classEntity'],
      });


      // Get teacher's free times
      const teacherFreeTimes = await this.freeTimeService.list(booking.teacher.id);

      // Parse class times
      const parseTimeString = (timeStr: string | Date) => {
        console.log('Parsing time string:', timeStr);

        if (timeStr instanceof Date) {
          return timeStr;
        }

        try {
          // If the string is already in a formatted date string (contains commas)
          if (timeStr.includes(',')) {
            const [datePart, timePart] = timeStr.split(', ');
            const [month, day, year] = datePart.split('/');
            const [time, period] = timePart.split(' ');
            const [hours, minutes] = time.split(':');

            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;

            const resultDate = new Date(Date.UTC(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
              hour - 7, // Adjust for UTC+7
              parseInt(minutes)
            ));

            console.log('Parsed formatted date:', {
              input: timeStr,
              output: resultDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
            });

            return resultDate;
          }

          // Parse raw date string in format "HH:mm dd/MM/yyyy"
          const [timePart, datePart] = timeStr.split(' ');
          if (!timePart || !datePart) {
            throw new Error('Invalid time format');
          }

          const [hours, minutes] = timePart.split(':');
          const [day, month, year] = datePart.split('/');

          const resultDate = new Date(Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours) - 7, // Adjust for UTC+7
            parseInt(minutes)
          ));

          console.log('Parsed raw date:', {
            input: timeStr,
            output: resultDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
          });

          return resultDate;
        } catch (error) {
          console.error('Error parsing date:', timeStr, error);
          throw new BadRequestException(`Invalid date format: ${timeStr}`);
        }
      };

      const newClassStart = parseTimeString(booking.classEntity.time_start);
      const newClassEnd = parseTimeString(booking.classEntity.time_end);

      const isOverlapping = teacherAcceptedBookings.some(b => {
        if (b.classEntity.id === booking.classEntity.id) return false; // bỏ qua chính booking này
        const start = parseTimeString(b.classEntity.time_start);
        const end = parseTimeString(b.classEntity.time_end);
        return (newClassStart < end && newClassEnd > start);
      });

      if (isOverlapping) {
        throw new BadRequestException('Bạn đã nhận lớp học khác trong khung giờ này rồi');
      }

      const classStart = parseTimeString(booking.classEntity.time_start);
      const classEnd = parseTimeString(booking.classEntity.time_end);



      // Find any free time that overlaps with the class time
      const overlappingFreeTime = teacherFreeTimes.find(freeTime => {
        const freeTimeStart = parseTimeString(freeTime.time_start);
        const freeTimeEnd = parseTimeString(freeTime.time_end);



        // Check if there's any overlap between the free time and class time
        return (classStart <= freeTimeEnd && classEnd >= freeTimeStart);
      });

      if (overlappingFreeTime) {
        // Split the free time slot
        const freeTimeStart = parseTimeString(overlappingFreeTime.time_start);
        const freeTimeEnd = parseTimeString(overlappingFreeTime.time_end);

        // Create new free time slots first
        const newFreeTimes = [];

        // Only create free time from class end to original end
        const afterClassFreeTime = await this.freeTimeService.create(booking.teacher.id, {
          time_start: `${classEnd.getHours().toString().padStart(2, '0')}:${classEnd.getMinutes().toString().padStart(2, '0')} ${classEnd.getDate().toString().padStart(2, '0')}/${(classEnd.getMonth() + 1).toString().padStart(2, '0')}/${classEnd.getFullYear()}`,
          time_end: `${freeTimeEnd.getHours().toString().padStart(2, '0')}:${freeTimeEnd.getMinutes().toString().padStart(2, '0')} ${freeTimeEnd.getDate().toString().padStart(2, '0')}/${(freeTimeEnd.getMonth() + 1).toString().padStart(2, '0')}/${freeTimeEnd.getFullYear()}`,
          title: overlappingFreeTime.title,
          note: overlappingFreeTime.note
        });
        newFreeTimes.push(afterClassFreeTime);

        // Delete the original free time after creating new one
        await this.freeTimeService.delete(overlappingFreeTime.id);
      }
    }

    if (booking.teacher.id !== currentAccountId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    booking.status = updateDto.status;
    const updatedBooking = await this.bookingRepo.save(booking);

    // Create notification for student when booking status changes
    if (updatedBooking.status === 1) {
      await this.notificationService.createNotification(
        booking.classEntity.student.id,
        `Lớp học "${booking.classEntity.lecture.name}" đã được chấp nhận`
      );
    }

    return updatedBooking;
  }

  async getBookingsByCurrentAccount(currentAccountId: number): Promise<Booking[]> {
    const currentDate = new Date();

    return this.bookingRepo.find({
      where: {
        teacher: { id: currentAccountId },
        status: Not(0),
        classEntity: {
          time_end: LessThan(currentDate)
        }
      },
      relations: ['classEntity', 'classEntity.lecture', 'classEntity.student',],
      order: {
        created_at: 'DESC'
      }
    });
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepo.find({
      relations: ['classEntity', 'classEntity.lecture', 'classEntity.student', 'teacher'],
      order: {
        created_at: 'DESC'
      }
    });
  }

  async updateBookingStatusByAdmin(bookingId: number, updateDto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['teacher', 'classEntity', 'classEntity.student', 'classEntity.bookings.teacher', 'classEntity.lecture'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (updateDto.status === 1) {
      const hasAcceptedBooking = booking.classEntity.bookings.some(
        (b) => b.id !== bookingId && b.status === 1
      );

      if (hasAcceptedBooking) {
        throw new BadRequestException('This class already has an accepted booking');
      }

      // Kiểm tra giáo viên đã có booking accepted nào trùng giờ chưa
      const teacherAcceptedBookings = await this.bookingRepo.find({
        where: {
          teacher: { id: booking.teacher.id },
          status: 1, // đã accept
        },
        relations: ['classEntity'],
      });


      // Get teacher's free times
      const teacherFreeTimes = await this.freeTimeService.list(booking.teacher.id);

      // Parse class times
      const parseTimeString = (timeStr: string | Date) => {
        console.log('Parsing time string:', timeStr);

        if (timeStr instanceof Date) {
          return timeStr;
        }

        try {
          // If the string is already in a formatted date string (contains commas)
          if (timeStr.includes(',')) {
            const [datePart, timePart] = timeStr.split(', ');
            const [month, day, year] = datePart.split('/');
            const [time, period] = timePart.split(' ');
            const [hours, minutes] = time.split(':');

            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;

            const resultDate = new Date(Date.UTC(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
              hour - 7, // Adjust for UTC+7
              parseInt(minutes)
            ));

            console.log('Parsed formatted date:', {
              input: timeStr,
              output: resultDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
            });

            return resultDate;
          }

          // Parse raw date string in format "HH:mm dd/MM/yyyy"
          const [timePart, datePart] = timeStr.split(' ');
          if (!timePart || !datePart) {
            throw new Error('Invalid time format');
          }

          const [hours, minutes] = timePart.split(':');
          const [day, month, year] = datePart.split('/');

          const resultDate = new Date(Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours) - 7, // Adjust for UTC+7
            parseInt(minutes)
          ));

          console.log('Parsed raw date:', {
            input: timeStr,
            output: resultDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
          });

          return resultDate;
        } catch (error) {
          console.error('Error parsing date:', timeStr, error);
          throw new BadRequestException(`Invalid date format: ${timeStr}`);
        }
      };


      const newClassStart = parseTimeString(booking.classEntity.time_start);
      const newClassEnd = parseTimeString(booking.classEntity.time_end);

      const isOverlapping = teacherAcceptedBookings.some(b => {
        if (b.classEntity.id === booking.classEntity.id) return false; // bỏ qua chính booking này
        const start = parseTimeString(b.classEntity.time_start);
        const end = parseTimeString(b.classEntity.time_end);
        return (newClassStart < end && newClassEnd > start);
      });

      if (isOverlapping) {
        throw new BadRequestException('Bạn đã nhận lớp học khác trong khung giờ này rồi');
      }

      const classStart = parseTimeString(booking.classEntity.time_start);
      const classEnd = parseTimeString(booking.classEntity.time_end);

      console.log('Class times:', {
        start: classStart.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
        end: classEnd.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
      });

      // Find any free time that overlaps with the class time
      const overlappingFreeTime = teacherFreeTimes.find(freeTime => {
        const freeTimeStart = parseTimeString(freeTime.time_start);
        const freeTimeEnd = parseTimeString(freeTime.time_end);

        console.log('Checking free time:', {
          id: freeTime.id,
          start: freeTimeStart.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
          end: freeTimeEnd.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
        });

        // Check if there's any overlap between the free time and class time
        return (classStart <= freeTimeEnd && classEnd >= freeTimeStart);
      });

      if (overlappingFreeTime) {
        // Split the free time slot
        const freeTimeStart = parseTimeString(overlappingFreeTime.time_start);
        const freeTimeEnd = parseTimeString(overlappingFreeTime.time_end);

        // Create new free time slots first
        const newFreeTimes = [];

        // Only create free time from class end to original end
        const afterClassFreeTime = await this.freeTimeService.create(booking.teacher.id, {
          time_start: `${classEnd.getHours().toString().padStart(2, '0')}:${classEnd.getMinutes().toString().padStart(2, '0')} ${classEnd.getDate().toString().padStart(2, '0')}/${(classEnd.getMonth() + 1).toString().padStart(2, '0')}/${classEnd.getFullYear()}`,
          time_end: `${freeTimeEnd.getHours().toString().padStart(2, '0')}:${freeTimeEnd.getMinutes().toString().padStart(2, '0')} ${freeTimeEnd.getDate().toString().padStart(2, '0')}/${(freeTimeEnd.getMonth() + 1).toString().padStart(2, '0')}/${freeTimeEnd.getFullYear()}`,
          title: overlappingFreeTime.title,
          note: overlappingFreeTime.note
        });
        newFreeTimes.push(afterClassFreeTime);

        // Delete the original free time after creating new one
        await this.freeTimeService.delete(overlappingFreeTime.id);
      }
    }

    booking.status = updateDto.status;
    const updatedBooking = await this.bookingRepo.save(booking);

    // Create notification for student when booking status changes
    if (updatedBooking.status === 1) {
      await this.notificationService.createNotification(
        booking.classEntity.student.id,
        `Lớp học "${booking.classEntity.lecture.name}" đã được chấp nhận`
      );
    }

    return updatedBooking;
  }
}
