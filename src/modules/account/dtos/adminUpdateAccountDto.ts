import { IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class AdminUpdateAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsBoolean()
  @IsOptional()
  isActived?: boolean;
}
