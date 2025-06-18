import { IsString, IsOptional } from 'class-validator';

export class UpdateRoadmapDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
