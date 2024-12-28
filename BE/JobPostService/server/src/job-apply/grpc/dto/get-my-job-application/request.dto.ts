import { IsNotEmpty, IsString } from 'class-validator';

export class GetMyJobApplicationRequest {
  @IsString()
  @IsNotEmpty()
  jobApplicationId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
