import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreeTime } from '../../entities/free_time.entity';
import { CreateFreeTimeDto } from './dto/create-free-time.dto';
import { Account } from '../../entities/account.entity';
import { BookingStatus } from '../../common/enums/booking-status.enum';

@Injectable()
export class FreeTimeService {
  constructor(
    @InjectRepository(FreeTime)
    private freeTimeRepository: Repository<FreeTime>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  /**
   * Parse time string in format "HH:MM DD/MM/YYYY" to Date object
   * @param timeStr Time string in format "HH:MM DD/MM/YYYY"
   * @returns Date object
   */
  private parseTime(timeStr: string): Date {
    const [time, date] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    const [day, month, year] = date.split('/');

    // Create date in local timezone
    const dateObj = new Date();
    dateObj.setFullYear(parseInt(year));
    dateObj.setMonth(parseInt(month) - 1); // Month is 0-based
    dateObj.setDate(parseInt(day));
    dateObj.setHours(parseInt(hours));
    dateObj.setMinutes(parseInt(minutes));
    dateObj.setSeconds(0);
    dateObj.setMilliseconds(0);

    console.log('Parsed date:', {
      input: timeStr,
      output: dateObj.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
      hours: dateObj.getHours(),
      minutes: dateObj.getMinutes()
    });

    return dateObj;
  }

  /**
   * Validate time range
   */
  private validateTimeRange(start: Date, end: Date): void {
    if (start >= end) {
      throw new BadRequestException('Time start must be less than time end');
    }
  }

  /**
   * Check if there are any overlapping bookings
   */
  private checkOverlappingBookings(teacher: Account, start: Date, end: Date, excludeFreeTimeId?: number): void {
    const existingBookings = teacher.bookingsAsTeacher.filter(
      (booking) =>
        booking.status !== BookingStatus.CANCELLED &&
        ((() => {
          const bookingStart = new Date(booking.classEntity.time_start);
          const bookingEnd = new Date(booking.classEntity.time_end);
          const localBookingStart = new Date(bookingStart.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
          const localBookingEnd = new Date(bookingEnd.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
          return (localBookingStart >= start && localBookingStart <= end) || (localBookingEnd >= start && localBookingEnd <= end);
        })()),
    );

    if (existingBookings.length > 0) {
      throw new BadRequestException(
        'Cannot create free time. There are existing bookings in this time range.',
      );
    }
  }

  /**
   * Check if there are any overlapping free times
   */
  private checkOverlappingFreeTimes(teacher: Account, start: Date, end: Date, excludeFreeTimeId?: number): void {
    // Filter out the current free time being updated
    const otherFreeTimes = teacher.freeTimes.filter(freeTime => !excludeFreeTimeId || freeTime.id !== excludeFreeTimeId);

    const existingFreeTimes = otherFreeTimes.filter((freeTime) => {
      // Parse the time strings from database using the same method as input
      const existingStart = new Date(freeTime.time_start);
      const existingEnd = new Date(freeTime.time_end);

      // Convert to local timezone for comparison
      const localExistingStart = new Date(existingStart.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
      const localExistingEnd = new Date(existingEnd.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

      return (
        (start >= localExistingStart && start < localExistingEnd) || // New start is within existing range
        (end > localExistingStart && end <= localExistingEnd) || // New end is within existing range
        (start <= localExistingStart && end >= localExistingEnd) // New range completely contains existing range
      );
    });

    if (existingFreeTimes.length > 0) {
      throw new BadRequestException(
        'Cannot create free time. There are existing free times in this time range.',
      );
    }
  }

  /**
   * Check if two time ranges overlap
   */
  private isTimeRangeOverlapping(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ): boolean {
    return (
      (start1 >= start2 && start1 < end2) || // First start is within second range
      (end1 > start2 && end1 <= end2) || // First end is within second range
      (start1 <= start2 && end1 >= end2) // First range completely contains second range
    );
  }

  /**
   * Log time ranges for debugging
   */


  /**
   * Create a new free time for a teacher
   */
  async create(teacherId: number, createFreeTimeDto: CreateFreeTimeDto): Promise<FreeTime> {
    // Parse and validate time range
    const newStart = this.parseTime(createFreeTimeDto.time_start);
    const newEnd = this.parseTime(createFreeTimeDto.time_end);
    this.validateTimeRange(newStart, newEnd);

    // Get teacher with relations
    const teacher = await this.accountRepository.findOne({
      where: { id: teacherId },
      relations: ['freeTimes', 'bookingsAsTeacher.classEntity'],
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    // Check for overlapping bookings and free times
    this.checkOverlappingBookings(teacher, newStart, newEnd);
    this.checkOverlappingFreeTimes(teacher, newStart, newEnd);

    // Create and save free time with parsed dates
    const freeTime = this.freeTimeRepository.create({
      title: createFreeTimeDto.title,
      note: createFreeTimeDto.note,
      time_start: newStart.toISOString(),
      time_end: newEnd.toISOString(),
      teacher,
    });

    return this.freeTimeRepository.save(freeTime);
  }

  /**
   * Update an existing free time
   */
  async update(teacherId: number, freeTimeId: number, updateFreeTimeDto: CreateFreeTimeDto): Promise<FreeTime> {
    // Find the free time
    const freeTime = await this.freeTimeRepository.findOne({
      where: { id: freeTimeId },
      relations: ['teacher'],
    });
    if (!freeTime) {
      throw new NotFoundException('Free time not found');
    }

    // Check if the teacher owns this free time
    if (freeTime.teacher.id !== teacherId) {
      throw new BadRequestException('You can only update your own free times');
    }

    // Parse and validate time range
    const newStart = this.parseTime(updateFreeTimeDto.time_start);
    const newEnd = this.parseTime(updateFreeTimeDto.time_end);
    this.validateTimeRange(newStart, newEnd);

    // Get teacher with relations
    const teacher = await this.accountRepository.findOne({
      where: { id: teacherId },
      relations: ['freeTimes', 'bookingsAsTeacher.classEntity'],
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found');
    }

    // Check for overlapping bookings and free times (excluding current free time)
    this.checkOverlappingBookings(teacher, newStart, newEnd);
    this.checkOverlappingFreeTimes(teacher, newStart, newEnd, freeTimeId);

    // Update free time with parsed dates
    Object.assign(freeTime, {
      title: updateFreeTimeDto.title,
      note: updateFreeTimeDto.note,
      time_start: newStart.toISOString(),
      time_end: newEnd.toISOString(),
    });

    console.log('Updating free time with:', {
      title: freeTime.title,
      note: freeTime.note,
      time_start: freeTime.time_start,
      time_end: freeTime.time_end,
    });

    return this.freeTimeRepository.save(freeTime);
  }

  async list(teacherId: number): Promise<FreeTime[]> {
    console.log('Getting free times for teacher:', teacherId);
    const freeTimes = await this.freeTimeRepository.find({
      where: { teacher: { id: teacherId } },
      order: {
        time_start: 'ASC'
      }
    });
    console.log('Found free times:', freeTimes.map(ft => ({
      id: ft.id,
      start: ft.time_start,
      end: ft.time_end
    })));
    return freeTimes;
  }

  async getAllFreeTimes(): Promise<FreeTime[]> {
    return this.freeTimeRepository.find({
      relations: ['teacher'],
      order: {
        time_start: 'DESC'
      }
    });
  }

  async delete(freeTimeId: number): Promise<void> {
    const freeTime = await this.freeTimeRepository.findOne({
      where: { id: freeTimeId }
    });

    if (!freeTime) {
      throw new NotFoundException('Free time not found');
    }

    await this.freeTimeRepository.remove(freeTime);
  }
}
