import { IsNotEmpty, IsString } from 'class-validator';

export class GetMyInterestedJobPostRequest {
  @IsString()
  @IsNotEmpty()
  jobPostId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
