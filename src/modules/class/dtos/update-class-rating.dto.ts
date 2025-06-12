import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';

export class UpdateClassRatingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
