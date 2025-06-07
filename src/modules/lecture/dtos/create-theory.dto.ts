import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTheoryDto {
  @IsNotEmpty()
  content: Buffer;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  mimeType: string;
}
