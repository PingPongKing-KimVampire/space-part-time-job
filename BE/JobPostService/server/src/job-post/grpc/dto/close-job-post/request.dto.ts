import { IsNotEmpty, IsString } from 'class-validator';

export class CloseJobPostRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  jobPostId: string;
}
