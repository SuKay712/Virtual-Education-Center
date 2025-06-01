import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  num_classes?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
