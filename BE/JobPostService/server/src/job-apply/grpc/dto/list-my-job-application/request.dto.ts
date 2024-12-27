import { IsNotEmpty, IsString } from 'class-validator';

export class ListMyJobApplicationRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
