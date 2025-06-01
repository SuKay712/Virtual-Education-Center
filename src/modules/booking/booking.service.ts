import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, LessThan } from 'typeorm';
import { Booking, Account, Class } from '../../entities';
import { UpdateBookingStatusDto } from './dtos/update-booking-status.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { NotificationService } from '../notification/notification.service';

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
      await this.notificationService.createNotification(
        booking.teacher.id,
        `You have been invited to teach a class: ${classEntity.lecture.name} at ${classEntity.time_start}`
      );
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
        `Your class "${booking.classEntity.lecture.name}" has been accepted`
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
      relations: ['classEntity', 'classEntity.lecture', 'classEntity.student'],
      order: {
        created_at: 'DESC'
      }
    });
  }
}
