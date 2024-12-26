import { IsNotEmpty, IsString } from 'class-validator';

export class ListMyInterestedJobPostRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
