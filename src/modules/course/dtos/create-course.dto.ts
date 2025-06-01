import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  num_classes: number;

  @IsOptional()
  @IsString()
  description?: string;
}
