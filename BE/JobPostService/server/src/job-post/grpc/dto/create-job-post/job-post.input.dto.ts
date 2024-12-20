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
  ArrayUnique,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  DayOfWeek,
  JobCategory,
  SalaryType,
  WorkPeriodType,
  WorkTimeType,
} from 'src/job-post/mongoose/job-post.enum';

import {
  IsDateWithinOneMonth,
  IsValidWorkPeriod,
  IsValidWorkTime,
} from './job-post.input.dto.validator';
import {
  DayOfWeekMapping,
  JobCategoryMapping,
  SalaryTypeMapping,
  WorkPeriodTypeMapping,
  WorkTimeTypeMapping,
} from 'src/job-post/grpc/job-post.enum-mapping';

export class WorkPeriodInput {
  @IsEnum(WorkPeriodType)
  @Transform(({ value }) => WorkPeriodTypeMapping[value], { toClassOnly: true })
  type: WorkPeriodType;

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

  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @ArrayMinSize(1, { message: '요일은 최소 1개 이상 선택해야 합니다.' })
  @Transform(({ value }) => value.map((v: number) => DayOfWeekMapping[v]), {
    toClassOnly: true,
  })
  days?: string[];
}

export class WorkTimeInput {
  @IsEnum(WorkTimeType)
  @Transform(({ value }) => WorkTimeTypeMapping[value], { toClassOnly: true })
  type: WorkTimeType;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message:
      '시간 형식은 00:00부터 23:59까지 가능하며, HH:mm 형식을 따라야 합니다.',
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message:
      '시간 형식은 00:00부터 23:59까지 가능하며, HH:mm 형식을 따라야 합니다.',
  })
  endTime?: string;
}

export class SalaryInput {
  @IsEnum(SalaryType)
  @Transform(({ value }) => SalaryTypeMapping[value], { toClassOnly: true })
  salaryType: SalaryType;

  @IsNumber()
  @ValidateIf((o) => o.salaryType === SalaryType.HOURLY)
  @Min(9860, { message: '시급은 최소 9860 이상이어야 합니다.' })
  salaryAmount: number;
}

export class CreateJobPostInput {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: '제목은 6자 이상이여야 합니다.' })
  @MaxLength(30, { message: '제목은 30자 이하이여야 합니다.' })
  @Matches(/\S/, { message: '제목에 공백이 아닌 문자가 포함되어야 합니다.' })
  title: string;

  @IsArray()
  @IsEnum(JobCategory, { each: true })
  @ArrayMinSize(1, { message: '하는 일은 최소 1개 선택해야 합니다.' })
  @ArrayMaxSize(3, { message: '하는 일은 최대 3개까지 선택할 수 있습니다.' })
  @ArrayUnique({ message: '같은 일을 중복으로 선택할 수 없습니다.' })
  @Transform(
    ({ value }) => value.map((job: number) => JobCategoryMapping[job]),
    { toClassOnly: true },
  )
  jobDescription: string[];

  @Validate(IsValidWorkPeriod)
  @ValidateNested()
  @Type(() => WorkPeriodInput)
  workPeriod: WorkPeriodInput;

  @ValidateNested()
  @Validate(IsValidWorkTime)
  @Type(() => WorkTimeInput)
  workTime: WorkTimeInput;

  @ValidateNested()
  @Type(() => SalaryInput)
  salary: SalaryInput;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: '각 사진은 유효한 URL 형식이어야 합니다.' })
  @ArrayMaxSize(10, { message: '사진은 최대 10개까지 업로드 가능합니다.' })
  photos?: string[];

  @IsString()
  @MinLength(15, { message: '상세 설명은 최소 15자 이상이어야 합니다.' })
  @MaxLength(2000, { message: '상세 설명은 최대 2000자 이하이어야 합니다.' })
  @Matches(/\S/, { message: '상세 설명에 공백이 아닌 문자가 포함되어야 합니다.' })
  detailedDescription: string;

  @IsString()
  @MaxLength(300, { message: '주소는 최대 300자 이하이어야 합니다.' })
  addressName: string;
}
