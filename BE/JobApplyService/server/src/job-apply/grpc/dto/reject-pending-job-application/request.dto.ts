import { IsNotEmpty, IsString } from 'class-validator';

export class RejectPendingJobApplicationRequest {
  @IsString()
  @IsNotEmpty()
  jobPostId: string;
}
