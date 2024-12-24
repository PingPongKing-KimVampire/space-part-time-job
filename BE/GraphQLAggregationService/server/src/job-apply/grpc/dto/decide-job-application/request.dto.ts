import { ApplicationStatusGrpcType } from '../apply-to-job-post/response.dto';

export class DecideJobApplicationRequest {
  jobApplicationId: string;
  userId: string;
  status: ApplicationStatusGrpcType;
}
