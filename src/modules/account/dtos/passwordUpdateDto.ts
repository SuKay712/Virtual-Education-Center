import { IsEmpty, IsNotEmpty } from 'class-validator';

export class PasswordUpdateDto {
  @IsNotEmpty()
  currentPassword: string;
  @IsNotEmpty()
  newPassword: string;
  @IsNotEmpty()
  confirmPassword: string;
}
