import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
  ArrayMaxSize,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ValidateIf,
  Matches,
  Min,
  IsUrl,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DayOfWeek,
  JobCategory,
  SalaryType,
  WorkPeriodType,
  WorkTimeType,
} from 'src/job-post/mongoose/job-post.enum';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { parse, isValid, addMonths, isAfter } from 'date-fns';

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

@InputType()
export class WorkPeriodInput {
  @Field()
  @IsEnum(WorkPeriodType)
  type: WorkPeriodType;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    each: true,
    message: '날짜 형식은 YYYY-MM-DD 이어야 합니다.',
  })
  @Validate(IsDateWithinOneMonth, {
    message: '날짜는 오늘부터 한 달 내의 날짜여야 합니다.',
  })
  dates?: string[];

  @Field(() => [DayOfWeek], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @ArrayMinSize(1, { message: '요일은 최소 1개 이상 선택해야 합니다.' })
  days?: string[];
}

@InputType()
export class WorkTimeInput {
  @Field()
  @IsEnum(WorkTimeType)
  type: WorkTimeType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: '시간 형식은 HH:mm 이어야 합니다.' })
  startTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: '시간 형식은 HH:mm 이어야 합니다.' })
  endTime?: string;
}

@InputType()
export class SalaryInput {
  @Field()
  @IsEnum(SalaryType)
  salaryType: SalaryType;

  @Field()
  @IsNumber()
  @ValidateIf((o) => o.salaryType === SalaryType.HOURLY)
  @Min(9860, { message: '시급은 최소 9860 이상이어야 합니다.' })
  salaryAmount: number;
}

@InputType()
export class CreateJobPostInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: '제목은 6자 이상이여야 합니다.' })
  @MaxLength(30, { message: '제목은 30자 이하이여야 합니다.' })
  title: string;

  @Field(() => [JobCategory])
  @IsArray()
  @IsEnum(JobCategory, { each: true })
  @ArrayMinSize(1, { message: '하는 일은 최소 1개 선택해야 합니다.' })
  @ArrayMaxSize(3, { message: '하는 일은 최대 3개까지 선택할 수 있습니다.' })
  jobDescription: string[];

  @Field(() => WorkPeriodInput)
  @Validate(IsValidWorkPeriod)
  @ValidateNested()
  @Type(() => WorkPeriodInput)
  workPeriod: WorkPeriodInput;

  @Field(() => WorkTimeInput)
  @ValidateNested()
  @Validate(IsValidWorkTime)
  @Type(() => WorkTimeInput)
  workTime: WorkTimeInput;

  @Field(() => SalaryInput)
  @ValidateNested()
  @Type(() => SalaryInput)
  salary: SalaryInput;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: '각 사진은 유효한 URL 형식이어야 합니다.' })
  @ArrayMaxSize(10, { message: '사진은 최대 10개까지 업로드 가능합니다.' })
  photos?: string[];

  @Field({ nullable: true })
  @IsString()
  @MinLength(15, { message: '상세 설명은 최소 15자 이상이어야 합니다.' })
  @MaxLength(2000, { message: '상세 설명은 최대 2000자 이하이어야 합니다.' })
  detailedDescription: string;
}
