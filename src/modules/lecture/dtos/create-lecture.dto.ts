import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
