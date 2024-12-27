import { IsNotEmpty, IsString } from 'class-validator';

export class CountJobApplicationByPostRequest {
  @IsString()
  @IsNotEmpty()
  jobPostId: string;
}
