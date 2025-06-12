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
import { Role } from 'src/common/enums';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('booking')
@UseGuards(AuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(new RoleGuard([Role.Admin]))
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() request: any,
  ) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Put(':id/update-status')
  async updateBookingStatus(
    @Param('id') id: number,
    @Body() updateDto: UpdateBookingStatusDto,
    @Req() request: any,
  ) {
    const currentAccount = request.currentAccount
    return this.bookingService.updateBookingStatus(id, updateDto, currentAccount.id);
  }

  @Get('/history')
  async getMyBookings(@Req() request: any) {
    const currentAccount = request.currentAccount;
    return this.bookingService.getBookingsByCurrentAccount(currentAccount.id);
  }

  @Get('/admin')
  @UseGuards(new RoleGuard([Role.Admin]))
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Put('/admin/:id/update-status')
  @UseGuards(new RoleGuard([Role.Admin]))
  async updateBookingStatusByAdmin(
    @Param('id') id: number,
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    return this.bookingService.updateBookingStatusByAdmin(id, updateDto);
  }
}
