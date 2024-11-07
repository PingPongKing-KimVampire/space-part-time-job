// Enums
export enum WorkPeriodType {
  SHORT_TERM = 'SHORT_TERM',
  LONG_TERM = 'LONG_TERM',
}

export enum WorkTimeType {
  FLEXIBLE = 'FLEXIBLE',
  FIXED = 'FIXED',
}

export enum SalaryType {
  HOURLY = 'HOURLY',
  PER_TASK = 'PER_TASK',
  MONTHLY = 'MONTHLY',
}

// Input Types
export class WorkPeriodInput {
  type: WorkPeriodType;
  dates?: string[];
  days?: string[];
}

export class WorkTimeInput {
  type: WorkTimeType;
  startTime?: string;
  endTime?: string;
}

export class SalaryInput {
  salaryType: SalaryType;
  salaryAmount: number;
}

export class CreateJobPostInput {
  title: string;
  jobDescription: string[];
  workPeriod: WorkPeriodInput;
  workTime: WorkTimeInput;
  salary: SalaryInput;
  photos?: string[];
  detailedDescription?: string;
}

// Response Types
export class WorkPeriod {
  type: WorkPeriodType;
  dates?: string[];
  days?: string[];
}

export class WorkTime {
  type: WorkTimeType;
  startTime?: string;
  endTime?: string;
}

export class Salary {
  salaryType: SalaryType;
  salaryAmount: number;
}

export class JobPost {
  id: string;
  title: string;
  jobDescription: string[];
  workPeriod: WorkPeriod;
  workTime: WorkTime;
  salary: Salary;
  photos: string[];
  detailedDescription?: string;
}
