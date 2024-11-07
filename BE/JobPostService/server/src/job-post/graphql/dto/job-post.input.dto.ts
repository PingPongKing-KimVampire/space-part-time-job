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
} from 'class-validator';
import { Type } from 'class-transformer';
import { SalaryType, WorkPeriodType, WorkTimeType } from './job-post.dto.enum';

@InputType()
export class WorkPeriodInput {
  @Field()
  @IsEnum(WorkPeriodType)
  type: WorkPeriodType;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dates?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  startTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endTime?: string;
}

@InputType()
export class SalaryInput {
  @Field()
  @IsEnum(SalaryType)
  salaryType: SalaryType;

  @Field()
  @IsNumber()
  salaryAmount: number;
}

@InputType()
export class CreateJobPostInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  jobDescription: string[];

  @Field(() => WorkPeriodInput)
  @ValidateNested()
  @Type(() => WorkPeriodInput)
  workPeriod: WorkPeriodInput;

  @Field(() => WorkTimeInput)
  @ValidateNested()
  @Type(() => WorkTimeInput)
  workTime: WorkTimeInput;

  @Field(() => SalaryInput)
  @ValidateNested()
  @Type(() => SalaryInput)
  salary: SalaryInput;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  photos?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  detailedDescription?: string;
}
