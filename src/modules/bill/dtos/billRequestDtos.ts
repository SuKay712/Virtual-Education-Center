import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Max, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { BillPaymentMethodEnum } from '../../../common/enums/bill-payment-method.enum';
import { Type } from 'class-transformer';

export class BillRequestDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsEnum(BillPaymentMethodEnum)
  paymentMethod: BillPaymentMethodEnum;

  @IsNotEmpty()
  @IsString()
  time_start: string;

  @IsNotEmpty()
  @IsString()
  time_end: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  @Type(() => Number)
  day_of_week: number[];
}
