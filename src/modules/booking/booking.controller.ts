import {
  Param,
  Body,
  Controller,
  Put,
  Post,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { UpdateBookingStatusDto } from './dtos/update-booking-status.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() request: any,
  ) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Put(':id/update-status')
  @UseGuards(AuthGuard)
  async updateBookingStatus(
    @Param('id') id: number,
    @Body() updateDto: UpdateBookingStatusDto,
    @Req() request: any,
  ) {
    const currentAccount = request.currentAccount
    return this.bookingService.updateBookingStatus(id, updateDto, currentAccount.id);
  }

  @Get('/history')
  @UseGuards(AuthGuard)
  async getMyBookings(@Req() request: any) {
    const currentAccount = request.currentAccount;
    return this.bookingService.getBookingsByCurrentAccount(currentAccount.id);
  }
}
