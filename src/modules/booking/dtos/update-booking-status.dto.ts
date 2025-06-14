import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../../../common/enums/booking-status.enum';



export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
