import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

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

  @IsDateString()
  @IsOptional()
  birthday?: string;

  @IsBoolean()
  @IsOptional()
  isActived?: boolean;
}
