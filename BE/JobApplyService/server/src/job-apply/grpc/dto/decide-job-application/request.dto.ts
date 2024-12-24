import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApplicationStatusGrpcType } from '../apply-to-job-post/response.dto';

export class DecideJobApplicationRequest {
  @IsString()
  @IsNotEmpty()
  jobApplicationId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ApplicationStatusGrpcType)
  @IsNotEmpty()
  status: ApplicationStatusGrpcType;
}
