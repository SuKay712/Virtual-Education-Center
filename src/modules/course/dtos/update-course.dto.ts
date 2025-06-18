import { IsOptional, IsNumber, IsString, Min, IsPositive } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  num_classes?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  roadmap_id?: number;
}
