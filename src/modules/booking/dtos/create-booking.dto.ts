import { IsNotEmpty, IsNumber, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  classId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  teacherIds: number[];
}
