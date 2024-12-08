import {
  DayOfWeek,
  JobCategory,
  SalaryType,
  WorkPeriodType,
  WorkTimeType,
} from 'src/graphql';

export const JobCategoryMapping = {
  0: JobCategory.SERVING,
  1: JobCategory.KITCHEN_ASSISTANT,
  2: JobCategory.CHEF,
  3: JobCategory.STORE_MANAGEMENT,
  4: JobCategory.BEVERAGE_MAKING,
  5: JobCategory.BAKING,
  6: JobCategory.CLEANING,
  7: JobCategory.ERRANDS,
  8: JobCategory.FLYER_DISTRIBUTION,
  9: JobCategory.TUTORING,
  10: JobCategory.SCHOOL_PICKUP_HELPER,
  11: JobCategory.CHILD_CARE,
  12: JobCategory.ELDER_CARE,
  13: JobCategory.HOUSEKEEPING,
  14: JobCategory.MOVING_ASSISTANCE,
  15: JobCategory.PET_CARE,
  16: JobCategory.CONVENIENCE_STORE,
  17: JobCategory.OTHER,
};

export const DayOfWeekMapping = {
  0: DayOfWeek.MONDAY,
  1: DayOfWeek.TUESDAY,
  2: DayOfWeek.WEDNESDAY,
  3: DayOfWeek.THURSDAY,
  4: DayOfWeek.FRIDAY,
  5: DayOfWeek.SATURDAY,
  6: DayOfWeek.SUNDAY,
};

export const WorkPeriodTypeMapping = {
  0: WorkPeriodType.SHORT_TERM,
  1: WorkPeriodType.LONG_TERM,
};

export const WorkTimeTypeMapping = {
  0: WorkTimeType.FLEXIBLE,
  1: WorkTimeType.FIXED,
};

export const SalaryTypeMapping = {
  0: SalaryType.HOURLY,
  1: SalaryType.PER_TASK,
  2: SalaryType.MONTHLY,
};
