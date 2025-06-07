import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateLectureDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
