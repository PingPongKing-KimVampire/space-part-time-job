import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { addMonths, isAfter, isValid, parse } from 'date-fns';
import {
  SalaryType,
  WorkPeriodType,
  WorkTimeType,
} from 'src/job-post/mongoose/job-post.enum';
import {
  SalaryInput,
  WorkPeriodInput,
  WorkTimeInput,
} from './job-post.input.dto';

@ValidatorConstraint({ name: 'isDateWithinOneMonth', async: false })
export class IsDateWithinOneMonth implements ValidatorConstraintInterface {
  validate(dates: string[], args: ValidationArguments) {
    const today = new Date();
    const oneMonthFromToday = addMonths(today, 1);

    return dates.every((dateStr) => {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      return (
        isValid(date) &&
        (isAfter(date, today) ||
          date.toDateString() === today.toDateString()) &&
        !isAfter(date, oneMonthFromToday)
      );
    });
  }

  defaultMessage(args: ValidationArguments) {
    return '날짜는 오늘부터 한 달 내의 날짜여야 합니다.';
  }
}

@ValidatorConstraint({ name: 'IsValidWorkPeriod', async: false })
export class IsValidWorkPeriod implements ValidatorConstraintInterface {
  validate(workPeriod: WorkPeriodInput, args: ValidationArguments) {
    if (workPeriod.type === WorkPeriodType.SHORT_TERM) {
      return (
        workPeriod.dates &&
        workPeriod.dates.length > 0 &&
        (!workPeriod.days || workPeriod.days.length === 0)
      );
    } else if (workPeriod.type === WorkPeriodType.LONG_TERM) {
      return (
        workPeriod.days &&
        workPeriod.days.length > 0 &&
        (!workPeriod.dates || workPeriod.dates.length === 0)
      );
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'SHORT_TERM일 때는 dates 필드가 필수이며 days 필드는 없어야 하고, LONG_TERM일 때는 days 필드가 필수이며 dates 필드는 없어야 합니다.';
  }
}

@ValidatorConstraint({ name: 'IsValidWorkTime', async: false })
export class IsValidWorkTime implements ValidatorConstraintInterface {
  validate(workTime: WorkTimeInput, args: ValidationArguments) {
    if (workTime.type === WorkTimeType.FIXED) {
      return !!workTime.startTime && !!workTime.endTime;
    } else if (workTime.type === WorkTimeType.FLEXIBLE) {
      return !workTime.startTime && !workTime.endTime;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'FIXED 근무 유형일 때는 startTime과 endTime이 필수이고, FLEXIBLE 근무 유형일 때는 startTime과 endTime이 없어야 합니다.';
  }
}

@ValidatorConstraint({ name: 'IsValidSalary', async: false })
export class IsValidSalary implements ValidatorConstraintInterface {
  validate(salary: SalaryInput, args: ValidationArguments): boolean {
    const { salaryType, salaryAmount } = salary;

    if (typeof salaryAmount !== 'number' || isNaN(salaryAmount)) {
      return false;
    }

    switch (salaryType) {
      case SalaryType.HOURLY:
        return salaryAmount >= 9860 && salaryAmount < 10_000_000;
      case SalaryType.MONTHLY:
        return salaryAmount < 1_000_000_000;
      case SalaryType.PER_TASK:
        return salaryAmount < 10_000_000_000;
      default:
        return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const salary = args.value as SalaryInput;
    switch (salary.salaryType) {
      case SalaryType.HOURLY:
        return '시급은 9860 이상, 1000만원 미만이어야 합니다.';
      case SalaryType.MONTHLY:
        return '월급은 10억원 미만이어야 합니다.';
      case SalaryType.PER_TASK:
        return '건당 100억원 미만이어야 합니다.';
      default:
        return '잘못된 급여 형태입니다.';
    }
  }
}
