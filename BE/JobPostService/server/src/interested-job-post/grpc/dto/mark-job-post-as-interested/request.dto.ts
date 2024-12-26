import { IsNotEmpty, IsString } from 'class-validator';

export class MarkJobPostAsInterestRequest {
  @IsString()
  @IsNotEmpty()
  jobPostId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
