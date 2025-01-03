
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ApplicationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}

export enum JobCategory {
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

export enum DayOfWeek {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export enum WorkPeriodType {
    SHORT_TERM = "SHORT_TERM",
    LONG_TERM = "LONG_TERM"
}

export enum WorkTimeType {
    FLEXIBLE = "FLEXIBLE",
    FIXED = "FIXED"
}

export enum SalaryType {
    HOURLY = "HOURLY",
    PER_TASK = "PER_TASK",
    MONTHLY = "MONTHLY"
}

export enum JobPostStatus {
    OPEN = "OPEN",
    CLOSE = "CLOSE"
}

export interface ApplyJobPostInput {
    jobPostId: string;
    coverLetter: string;
}

export interface DecideJobApplicationInput {
    id: string;
    status: ApplicationStatus;
}

export interface CreateJobPostInput {
    title: string;
    jobDescription: JobCategory[];
    workPeriod: WorkPeriodInput;
    workTime: WorkTimeInput;
    salary: SalaryInput;
    photos?: Nullable<string[]>;
    detailedDescription: string;
    addressName: string;
}

export interface WorkPeriodInput {
    type: WorkPeriodType;
    dates?: Nullable<string[]>;
    days?: Nullable<DayOfWeek[]>;
}

export interface WorkTimeInput {
    type: WorkTimeType;
    startTime?: Nullable<string>;
    endTime?: Nullable<string>;
}

export interface SalaryInput {
    salaryType: SalaryType;
    salaryAmount: BigInt;
}

export interface JobPostSearchFilter {
    neighborhoodIds?: Nullable<string[]>;
    workPeriodType?: Nullable<WorkPeriodType>;
    days?: Nullable<DayOfWeek[]>;
    jobCategories?: Nullable<JobCategory[]>;
    startTime?: Nullable<string>;
    endTime?: Nullable<string>;
    keyword?: Nullable<string>;
    status?: Nullable<JobPostStatus[]>;
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
    createdAt: string;
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
    status: ApplicationStatus;
    createdAt: string;
}

export interface JobPost {
    id: string;
    status: JobPostStatus;
    title: string;
    jobDescription: JobCategory[];
    workPeriod: WorkPeriod;
    workTime: WorkTime;
    salary: Salary;
    photos?: Nullable<string[]>;
    detailedDescription: string;
    addressName: string;
    createdAt: string;
    views: number;
    publisher: UserPublicInfo;
    applicationCount: number;
    applications: JobApplication[];
    myJobApplication?: Nullable<Nullable<JobApplication>[]>;
    myInterested?: Nullable<InterestedJobPost>;
    interestedCount: number;
}

export interface WorkPeriod {
    type: WorkPeriodType;
    dates?: Nullable<string[]>;
    days?: Nullable<DayOfWeek[]>;
}

export interface WorkTime {
    type: WorkTimeType;
    startTime?: Nullable<string>;
    endTime?: Nullable<string>;
}

export interface Salary {
    salaryType: SalaryType;
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
    phoneNumber: string;
    createdAt: string;
    residentNeighborhood?: Nullable<Neighborhood[]>;
}

export interface UserPublicInfo {
    id: string;
    nickname: string;
    createdAt: string;
}

export type BigInt = any;
type Nullable<T> = T | null;
