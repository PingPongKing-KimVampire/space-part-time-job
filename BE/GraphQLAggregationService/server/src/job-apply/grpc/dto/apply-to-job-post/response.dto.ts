export enum ApplyToJobPostResponseStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  CANCELED = 3,
}

export class ApplyToJobPostResponse {
  jobApplication: {
    id: string;
    userId: string;
    jobPostId: string;
    coverLetter: string;
    createdAt: string;
    status: ApplyToJobPostResponseStatus;
  };
}
