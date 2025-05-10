import { IsEnum, IsNotEmpty } from 'class-validator';

export enum BookingStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
}

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
