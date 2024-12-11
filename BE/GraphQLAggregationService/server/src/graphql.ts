
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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
    salaryAmount: number;
}

export interface JobPostSearchFilter {
    neighborhoodIds: string[];
    workPeriodType?: Nullable<WorkPeriodType>;
    days?: Nullable<DayOfWeek[]>;
    jobCategories?: Nullable<JobCategory[]>;
    startTime?: Nullable<string>;
    endTime?: Nullable<string>;
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

export interface JobPost {
    id: string;
    title: string;
    jobDescription: JobCategory[];
    workPeriod: WorkPeriod;
    workTime: WorkTime;
    salary: Salary;
    photos?: Nullable<string[]>;
    detailedDescription: string;
    addressName: string;
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
    salaryAmount: number;
}

export interface IMutation {
    createJobPost(input: CreateJobPostInput): Nullable<JobPost> | Promise<Nullable<JobPost>>;
    setResidentNeighborhood(input: SetResidentNeighborhoodInput): Neighborhood[] | Promise<Neighborhood[]>;
    _empty(): Nullable<string> | Promise<Nullable<string>>;
}

export interface IQuery {
    searchJobPosts(filters: JobPostSearchFilter, pagination: JobPostCursorInput): JobPostConnection | Promise<JobPostConnection>;
    me(): User | Promise<User>;
    _empty(): Nullable<string> | Promise<Nullable<string>>;
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
    residentNeighborhood?: Nullable<Neighborhood[]>;
}

type Nullable<T> = T | null;
