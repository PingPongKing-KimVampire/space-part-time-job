import {
  SalaryType,
  WorkPeriodType,
  WorkTimeType,
  JobCategory,
  DayOfWeek,
} from 'src/job-post/mongoose/job-post.enum';

export class WorkPeriod {
  type: WorkPeriodType;
  dates?: string[];
  days?: DayOfWeek[];
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
  jobDescription: JobCategory[];
  workPeriod: WorkPeriod;
  workTime: WorkTime;
  salary: Salary;
  photos: string[];
  detailedDescription: string;
}
