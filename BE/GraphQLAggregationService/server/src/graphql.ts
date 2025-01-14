
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

export interface ApplyJobPostInput {
    jobPostId: string;
    coverLetter: string;
}

export interface DecideJobApplicationInput {
    id: string;
    status: ApplicationStatusEnum;
}

export interface CreateJobPostInput {
    title: string;
    JobCategories: JobCategoryEnum[];
    workPeriod: WorkPeriodInput;
    workTime: WorkTimeInput;
    salary: SalaryInput;
    photos?: Nullable<URL[]>;
    detailedDescription: string;
    addressName: string;
}

export interface WorkPeriodInput {
    type: WorkPeriodEnum;
    dates?: Nullable<FormattedDate[]>;
    days?: Nullable<DayOfWeekEnum[]>;
}

export interface WorkTimeInput {
    type: WorkTimeEnum;
    startTime?: Nullable<FormattedTime>;
    endTime?: Nullable<FormattedTime>;
}

export interface SalaryInput {
    salaryType: SalaryEnum;
    salaryAmount: BigInt;
}

export interface JobPostSearchFilter {
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

export interface JobPostCursorInput {
    afterCursor?: Nullable<string>;
    first: number;
}

export interface SetResidentNeighborhoodInput {
    neighborhoods: NeighborhoodInput[];
}

export interface NeighborhoodInput {
    id: string;
    level: number;
}

export interface InterestedJobPost {
    jobPost: JobPost;
    createdAt: DateTime;
}

export interface IQuery {
    listMyInterestedJobPosts(): Nullable<InterestedJobPost>[] | Promise<Nullable<InterestedJobPost>[]>;
    getMyJobApplication(id: string): JobApplication | Promise<JobApplication>;
    listMyJobApplications(): Nullable<JobApplication>[] | Promise<Nullable<JobApplication>[]>;
    getJobPost(id: string): Nullable<JobPost> | Promise<Nullable<JobPost>>;
    searchJobPosts(filters: JobPostSearchFilter, pagination: JobPostCursorInput): JobPostConnection | Promise<JobPostConnection>;
    me(): User | Promise<User>;
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    markJobPostAsInterest(jobPostId: string): JobPost | Promise<JobPost>;
    unmarkJobPostAsInterest(jobPostId: string): JobPost | Promise<JobPost>;
    applyToJobPost(input: ApplyJobPostInput): JobApplication | Promise<JobApplication>;
    cancelJobApplication(id: string): JobApplication | Promise<JobApplication>;
    decideJobApplication(input: DecideJobApplicationInput): JobApplication | Promise<JobApplication>;
    closeJobPost(id: string): Nullable<JobPost> | Promise<Nullable<JobPost>>;
    createJobPost(input: CreateJobPostInput): Nullable<JobPost> | Promise<Nullable<JobPost>>;
    incrementJobPostViews(id: string): number | Promise<number>;
    setResidentNeighborhood(input: SetResidentNeighborhoodInput): Neighborhood[] | Promise<Neighborhood[]>;
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface JobApplication {
    id: string;
    jobPost: JobPost;
    coverLetter: string;
    applicant: UserPublicInfo;
    status: ApplicationStatusEnum;
    createdAt: DateTime;
}

export interface JobPost {
    id: string;
    status: JobPostStatusEnum;
    title: string;
    JobCategories: JobCategoryEnum[];
    workPeriod: WorkPeriod;
    workTime: WorkTime;
    salary: Salary;
    photos?: Nullable<URL[]>;
    detailedDescription: string;
    addressName: string;
    createdAt: DateTime;
    views: number;
    publisher: UserPublicInfo;
    applicationCount: number;
    applications: JobApplication[];
    myJobApplication?: Nullable<Nullable<JobApplication>[]>;
    myInterested?: Nullable<InterestedJobPost>;
    interestedCount: number;
}

export interface WorkPeriod {
    type: WorkPeriodEnum;
    dates?: Nullable<FormattedDate[]>;
    days?: Nullable<DayOfWeekEnum[]>;
}

export interface WorkTime {
    type: WorkTimeEnum;
    startTime?: Nullable<FormattedTime>;
    endTime?: Nullable<FormattedTime>;
}

export interface Salary {
    salaryType: SalaryEnum;
    salaryAmount: BigInt;
}

export interface JobPostConnection {
    totalCount: number;
    edges: JobPostEdge[];
    pageInfo: PageInfo;
}

export interface JobPostEdge {
    cursor: string;
    node: JobPost;
}

export interface PageInfo {
    hasNextPage: boolean;
    endCursor?: Nullable<string>;
}

export interface Neighborhood {
    id: string;
    level: number;
    name: string;
}

export interface User {
    id: string;
    nickname: string;
    phoneNumber: PhoneNumber;
    createdAt: DateTime;
    residentNeighborhood?: Nullable<Neighborhood[]>;
}

export interface UserPublicInfo {
    id: string;
    nickname: string;
    createdAt: DateTime;
}

export type PhoneNumber = any;
export type DateTime = any;
export type BigInt = any;
export type URL = any;
export type FormattedDate = any;
export type FormattedTime = any;
type Nullable<T> = T | null;
