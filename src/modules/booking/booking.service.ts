import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, Account } from '../../entities';
import { UpdateBookingStatusDto } from './dtos/update-booking-status.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async updateBookingStatus(bookingId: number, updateDto: UpdateBookingStatusDto, currentAccountId): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['classEntity', 'teacher', 'classEntity.bookings'],
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
    return this.bookingRepo.save(booking);
  }
}
