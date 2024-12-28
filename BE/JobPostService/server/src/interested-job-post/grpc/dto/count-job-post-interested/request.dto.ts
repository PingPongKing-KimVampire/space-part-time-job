import { IsNotEmpty, IsString } from 'class-validator';

export class CountJobPostInterestedRequest {
  @IsString()
  @IsNotEmpty()
  jobPostId: string;
}
