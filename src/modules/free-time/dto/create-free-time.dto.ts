import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateFreeTimeDto {
  @IsNotEmpty()
  @IsString()
  time_start: string;

  @IsNotEmpty()
  @IsString()
  time_end: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
