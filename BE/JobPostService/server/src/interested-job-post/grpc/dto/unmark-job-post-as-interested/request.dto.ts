import { IsNotEmpty, IsString } from 'class-validator';

export class UnmarkJobPostAsInterestRequest {
  @IsString()
  @IsNotEmpty()
  jobPostId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
