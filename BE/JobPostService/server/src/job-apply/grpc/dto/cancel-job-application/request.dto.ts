import { IsNotEmpty, IsString } from 'class-validator';

export class CancelJobApplicationRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  jobApplicationId: string;
}
