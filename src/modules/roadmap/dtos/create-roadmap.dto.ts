import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
