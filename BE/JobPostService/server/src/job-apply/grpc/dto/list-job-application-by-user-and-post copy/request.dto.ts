import { IsNotEmpty, IsString } from 'class-validator';

export class ListJobApplicationByUserAndPostRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  jobPostId: string;
}
