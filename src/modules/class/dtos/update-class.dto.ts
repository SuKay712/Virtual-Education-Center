import { IsNotEmpty, IsString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  time_start?: string;

  @IsOptional()
  @IsString()
  time_end?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  teacherIds?: number[];
}
