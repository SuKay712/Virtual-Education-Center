import {
  Param,
  Body,
  Controller,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { UpdateBookingStatusDto } from './dtos/update-booking-status.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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
}
