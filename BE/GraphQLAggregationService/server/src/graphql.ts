
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum JobCategoryEnum {
    SERVING = "SERVING",
    KITCHEN_ASSISTANT = "KITCHEN_ASSISTANT",
    CHEF = "CHEF",
    STORE_MANAGEMENT = "STORE_MANAGEMENT",
    BEVERAGE_MAKING = "BEVERAGE_MAKING",
    BAKING = "BAKING",
    CLEANING = "CLEANING",
    ERRANDS = "ERRANDS",
    FLYER_DISTRIBUTION = "FLYER_DISTRIBUTION",
    TUTORING = "TUTORING",
    SCHOOL_PICKUP_HELPER = "SCHOOL_PICKUP_HELPER",
    CHILD_CARE = "CHILD_CARE",
    ELDER_CARE = "ELDER_CARE",
    HOUSEKEEPING = "HOUSEKEEPING",
    MOVING_ASSISTANCE = "MOVING_ASSISTANCE",
    PET_CARE = "PET_CARE",
    CONVENIENCE_STORE = "CONVENIENCE_STORE",
    OTHER = "OTHER"
}

export enum DayOfWeekEnum {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export enum WorkPeriodEnum {
    SHORT_TERM = "SHORT_TERM",
    LONG_TERM = "LONG_TERM"
}

export enum WorkTimeEnum {
    FLEXIBLE = "FLEXIBLE",
    FIXED = "FIXED"
}

export enum SalaryEnum {
    HOURLY = "HOURLY",
    PER_TASK = "PER_TASK",
    MONTHLY = "MONTHLY"
}

export enum JobPostStatusEnum {
    OPEN = "OPEN",
    CLOSE = "CLOSE"
}

export enum ApplicationStatusEnum {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}

export class ApplyJobPostInput {
    jobPostId: string;
    coverLetter: string;
}

export class DecideJobApplicationInput {
    id: string;
    status: ApplicationStatusEnum;
}

export class CreateJobPostInput {
    title: string;
    jobCategories: JobCategoryEnum[];
    workPeriod: WorkPeriodInput;
    workTime: WorkTimeInput;
    salary: SalaryInput;
    photos?: Nullable<URL[]>;
    detailedDescription: string;
    addressName: string;
}

export class WorkPeriodInput {
    type: WorkPeriodEnum;
    dates?: Nullable<FormattedDate[]>;
    days?: Nullable<DayOfWeekEnum[]>;
}

export class WorkTimeInput {
    type: WorkTimeEnum;
    startTime?: Nullable<FormattedTime>;
    endTime?: Nullable<FormattedTime>;
}

export class SalaryInput {
    salaryType: SalaryEnum;
    salaryAmount: BigInt;
}

export class JobPostSearchFilter {
    neighborhoodIds?: Nullable<string[]>;
    workPeriodType?: Nullable<WorkPeriodEnum>;
    days?: Nullable<DayOfWeekEnum[]>;
    jobCategories?: Nullable<JobCategoryEnum[]>;
    startTime?: Nullable<FormattedTime>;
    endTime?: Nullable<FormattedTime>;
    keyword?: Nullable<string>;
    status?: Nullable<JobPostStatusEnum[]>;
    onlyMyPosts?: Nullable<boolean>;
}

export class JobPostCursorInput {
    afterCursor?: Nullable<string>;
    first: number;
}

export class SetResidentNeighborhoodInput {
    neighborhoods: NeighborhoodInput[];
}

export class NeighborhoodInput {
    id: string;
    level: number;
}

export interface BaseError {
    message: string;
}

export class InterestedJobPost {
    jobPost: JobPost;
    createdAt: DateTime;
}

export abstract class IQuery {
    abstract listMyInterestedJobPosts(): ListMyInterestedJobPostsResult | Promise<ListMyInterestedJobPostsResult>;

    abstract getMyJobApplication(id: string): GetMyJobApplicationResult | Promise<GetMyJobApplicationResult>;

    abstract listMyJobApplications(): ListMyJobApplicationsResult | Promise<ListMyJobApplicationsResult>;

    abstract getJobPost(id: string): GetJobPostResult | Promise<GetJobPostResult>;

    abstract searchJobPosts(filters: JobPostSearchFilter, pagination: JobPostCursorInput): SearchJobPostsResult | Promise<SearchJobPostsResult>;

    abstract me(): MeResult | Promise<MeResult>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export class InterestedJobPosts {
    interestedJobPosts: Nullable<InterestedJobPost>[];
}

export abstract class IMutation {
    abstract markJobPostAsInterest(jobPostId: string): MarkJobPostAsInterestResult | Promise<MarkJobPostAsInterestResult>;

    abstract unmarkJobPostAsInterest(jobPostId: string): UnmarkJobPostAsInterestResult | Promise<UnmarkJobPostAsInterestResult>;

    abstract applyToJobPost(input: ApplyJobPostInput): ApplyToJobPostResult | Promise<ApplyToJobPostResult>;

    abstract cancelJobApplication(id: string): CancelJobApplicationResult | Promise<CancelJobApplicationResult>;

    abstract decideJobApplication(input: DecideJobApplicationInput): DecideJobApplicationResult | Promise<DecideJobApplicationResult>;

    abstract closeJobPost(id: string): CloseJobPostResult | Promise<CloseJobPostResult>;

    abstract createJobPost(input: CreateJobPostInput): CreateJobPostResult | Promise<CreateJobPostResult>;

    abstract incrementJobPostViews(id: string): IncrementJobPostViewsResult | Promise<IncrementJobPostViewsResult>;

    abstract setResidentNeighborhood(input: SetResidentNeighborhoodInput): SetResidentNeighborhoodResult | Promise<SetResidentNeighborhoodResult>;

    abstract _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export class JobApplication {
    id: string;
    coverLetter: string;
    status: ApplicationStatusEnum;
    createdAt: DateTime;
    jobPost: JobApplicationJobPostResult;
    applicant: JobApplicationApplicantResult;
}

export class JobApplications {
    applications: Nullable<JobApplication>[];
}

export class JobPost {
    id: string;
    status: JobPostStatusEnum;
    title: string;
    jobCategories: JobCategoryEnum[];
    workPeriod: WorkPeriod;
    workTime: WorkTime;
    salary: Salary;
    photos?: Nullable<URL[]>;
    detailedDescription: string;
    addressName: string;
    createdAt: DateTime;
    views: number;
    publisher: JobPostPublisherResult;
    applicationCount: JobPostApplicationCountResult;
    applications: JobPostApplicationsResult;
    myJobApplication: JobPostMyJobApplicationResult;
    myInterested?: Nullable<InterestedJobPost>;
    interestedCount: number;
}

export class WorkPeriod {
    type: WorkPeriodEnum;
    dates?: Nullable<FormattedDate[]>;
    days?: Nullable<DayOfWeekEnum[]>;
}

export class WorkTime {
    type: WorkTimeEnum;
    startTime?: Nullable<FormattedTime>;
    endTime?: Nullable<FormattedTime>;
}

export class Salary {
    salaryType: SalaryEnum;
    salaryAmount: BigInt;
}

export class ApplicationCount {
    count: number;
}

export class ViewsCountType {
    count: number;
}

export class JobPostConnection {
    totalCount: number;
    edges: JobPostEdge[];
    pageInfo: PageInfo;
}

export class JobPostEdge {
    cursor: string;
    node: JobPost;
}

export class PageInfo {
    hasNextPage: boolean;
    endCursor?: Nullable<string>;
}

export class Neighborhood {
    id: string;
    level: number;
    name: string;
}

export class NeighborhoodList {
    neighborhoods: Neighborhood[];
}

export class User {
    id: string;
    nickname: string;
    phoneNumber: PhoneNumber;
    createdAt: DateTime;
    residentNeighborhoods: UserResidentNeighborhoodsResult;
}

export class ResidentNeighborhoodsType {
    neighborhoods: Neighborhood[];
}

export class UserPublicInfo {
    id: string;
    nickname: string;
    createdAt: DateTime;
}

export class NotFoundError implements BaseError {
    message: string;
}

export class BadInputError implements BaseError {
    message: string;
    invalidFields: string[];
}

export class InternalError implements BaseError {
    message: string;
}

export class ForbiddenError implements BaseError {
    message: string;
}

export type PhoneNumber = any;
export type DateTime = any;
export type BigInt = any;
export type URL = any;
export type FormattedDate = any;
export type FormattedTime = any;
export type ListMyInterestedJobPostsResult = InterestedJobPosts | InternalError;
export type MarkJobPostAsInterestResult = JobPost | NotFoundError | InternalError;
export type UnmarkJobPostAsInterestResult = JobPost | NotFoundError | InternalError;
export type JobApplicationJobPostResult = JobPost | InternalError;
export type JobApplicationApplicantResult = UserPublicInfo | InternalError;
export type ApplyToJobPostResult = JobApplication | BadInputError | InternalError;
export type CancelJobApplicationResult = JobApplication | NotFoundError | ForbiddenError;
export type DecideJobApplicationResult = JobApplication | BadInputError | NotFoundError | ForbiddenError | InternalError;
export type GetMyJobApplicationResult = JobApplication | ForbiddenError;
export type ListMyJobApplicationsResult = JobApplications | InternalError;
export type JobPostApplicationsResult = JobApplications | InternalError | ForbiddenError;
export type JobPostPublisherResult = UserPublicInfo | InternalError;
export type JobPostApplicationCountResult = ApplicationCount | InternalError;
export type JobPostMyJobApplicationResult = JobApplications | InternalError;
export type CloseJobPostResult = JobPost | NotFoundError | InternalError;
export type CreateJobPostResult = JobPost | BadInputError | InternalError;
export type GetJobPostResult = JobPost | NotFoundError | InternalError;
export type IncrementJobPostViewsResult = ViewsCountType | NotFoundError | InternalError;
export type SearchJobPostsResult = JobPostConnection | BadInputError | InternalError;
export type SetResidentNeighborhoodResult = NeighborhoodList | NotFoundError | BadInputError;
export type UserResidentNeighborhoodsResult = ResidentNeighborhoodsType | InternalError;
export type MeResult = User | InternalError;
type Nullable<T> = T | null;
