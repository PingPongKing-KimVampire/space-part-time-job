import { IsNotEmpty, IsString } from 'class-validator';

export class listJobApplicationsByPostForPublisherRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  jobPostId: string;
}
