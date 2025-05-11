import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { BillPaymentMethodEnum } from '../../../common/enums/bill-payment-method.enum';

export class BillRequestDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsEnum(BillPaymentMethodEnum)
  paymentMethod: BillPaymentMethodEnum;
}
