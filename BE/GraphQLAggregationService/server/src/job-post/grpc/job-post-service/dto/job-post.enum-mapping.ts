import {
  DayOfWeekEnum,
  JobCategoryEnum,
  JobPostStatusEnum,
  SalaryEnum,
  WorkPeriodEnum,
  WorkTimeEnum,
} from 'src/graphql';

export const JobCategoryEnumMapping = {
  0: JobCategoryEnum.SERVING,
  1: JobCategoryEnum.KITCHEN_ASSISTANT,
  2: JobCategoryEnum.CHEF,
  3: JobCategoryEnum.STORE_MANAGEMENT,
  4: JobCategoryEnum.BEVERAGE_MAKING,
  5: JobCategoryEnum.BAKING,
  6: JobCategoryEnum.CLEANING,
  7: JobCategoryEnum.ERRANDS,
  8: JobCategoryEnum.FLYER_DISTRIBUTION,
  9: JobCategoryEnum.TUTORING,
  10: JobCategoryEnum.SCHOOL_PICKUP_HELPER,
  11: JobCategoryEnum.CHILD_CARE,
  12: JobCategoryEnum.ELDER_CARE,
  13: JobCategoryEnum.HOUSEKEEPING,
  14: JobCategoryEnum.MOVING_ASSISTANCE,
  15: JobCategoryEnum.PET_CARE,
  16: JobCategoryEnum.CONVENIENCE_STORE,
  17: JobCategoryEnum.OTHER,
};

export const DayOfWeekEnumMapping = {
  0: DayOfWeekEnum.MONDAY,
  1: DayOfWeekEnum.TUESDAY,
  2: DayOfWeekEnum.WEDNESDAY,
  3: DayOfWeekEnum.THURSDAY,
  4: DayOfWeekEnum.FRIDAY,
  5: DayOfWeekEnum.SATURDAY,
  6: DayOfWeekEnum.SUNDAY,
};

export const WorkPeriodEnumMapping = {
  0: WorkPeriodEnum.SHORT_TERM,
  1: WorkPeriodEnum.LONG_TERM,
};

export const WorkTimeEnumMapping = {
  0: WorkTimeEnum.FLEXIBLE,
  1: WorkTimeEnum.FIXED,
};

export const SalaryEnumMapping = {
  0: SalaryEnum.HOURLY,
  1: SalaryEnum.PER_TASK,
  2: SalaryEnum.MONTHLY,
};

export const JobPostStatusEnumMapping = {
  1: JobPostStatusEnum.OPEN,
  2: JobPostStatusEnum.CLOSE,
};
