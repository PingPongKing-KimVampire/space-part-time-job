export enum ApplicationStatusGrpcType {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCELED = 3,
}

export class JobApplicationGrpc {
  id: string;
  userId: string;
  jobPostId: string;
  coverLetter: string;
  createdAt: string;
  status: ApplicationStatusGrpcType;
}

export class ApplyToJobPostResponse {
  jobApplication: JobApplicationGrpc;
}
