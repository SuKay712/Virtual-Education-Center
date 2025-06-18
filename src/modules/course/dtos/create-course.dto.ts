import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsPositive } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  num_classes: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  roadmap_id?: number;
}
