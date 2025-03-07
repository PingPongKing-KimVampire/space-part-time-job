import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
  IsNumber,
  Max,
  isNotEmpty,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  DayOfWeek,
  JobCategory,
  WorkPeriodType,
} from 'src/job-post/mongoose/job-post.enum';
import {
  DayOfWeekMapping,
  JobCategoryMapping,
  StatusMapping,
  WorkPeriodTypeMapping,
} from 'src/job-post/grpc/job-post.enum-mapping';
import { JobPostStatus } from 'src/job-post/mongoose/job-post.schema';

export class JobPostSearchFilter {
  @IsArray()
  neighborhoodIds?: string[];

  @IsOptional()
  @IsEnum(WorkPeriodType)
  @Transform(({ value }) => WorkPeriodTypeMapping[value], { toClassOnly: true })
  workPeriodType?: WorkPeriodType;

  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @Transform(({ value }) => value.map((v: number) => DayOfWeekMapping[v]), {
    toClassOnly: true,
  })
  days?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(JobCategory, { each: true })
  @Transform(({ value }) => value.map((v: number) => JobCategoryMapping[v]), {
    toClassOnly: true,
  })
  jobCategories?: string[];

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'startTime은 HH:mm 형식이어야 합니다.' })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'endTime은 HH:mm 형식이어야 합니다.' })
  endTime?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }) => value.map((v: number) => StatusMapping[v]), {
    toClassOnly: true,
  })
  @IsEnum(JobPostStatus, { each: true })
  status?: JobPostStatus[];

  @IsOptional()
  @IsBoolean()
  onlyMyPosts?: boolean;
}

export class JobPostCursorInput {
  @IsOptional()
  @IsString()
  afterCursor?: string;

  @IsNumber()
  @Min(1, { message: 'first는 최소 1 이상이어야 합니다.' })
  @Max(20, { message: 'first는 최대 20 이하이어야 합니다.' })
  first: number;
}

export class SearchJobPostsInput {
  @ValidateNested()
  @Type(() => JobPostSearchFilter)
  filters: JobPostSearchFilter;

  @ValidateNested()
  @Type(() => JobPostCursorInput)
  pagination: JobPostCursorInput;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
