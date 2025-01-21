import 'reflect-metadata'; // Reflect.getMetadata 관련 오류 방지
import { validate } from 'class-validator';
import { CreateJobPostInput } from './job-post.input.dto';
import {
  JobCategory,
  SalaryType,
  WorkPeriodType,
  WorkTimeType,
} from 'src/job-post/mongoose/job-post.enum';
import { plainToClass } from 'class-transformer';
import { addDays, addMonths, format } from 'date-fns';
import {
  DayOfWeekMapping,
  JobCategoryMapping,
  SalaryTypeMapping,
  WorkPeriodTypeMapping,
  WorkTimeTypeMapping,
} from '../../job-post.enum-mapping';

function reverseMapping(
  mapping: Record<number, string>,
): Record<number, string> {
  return Object.entries(mapping).reduce((reversed, [key, value]) => {
    reversed[value] = key;
    return reversed;
  }, {});
}

const ReverseJobCategoryMapping = reverseMapping(JobCategoryMapping);
const ReverseDayOfWeekMapping = reverseMapping(DayOfWeekMapping);
const ReverseWorkPeriodTypeMapping = reverseMapping(WorkPeriodTypeMapping);
const ReverseWorkTimeTypeMapping = reverseMapping(WorkTimeTypeMapping);
const ReverseSalaryTypeMapping = reverseMapping(SalaryTypeMapping);

describe('CreateJobPostInput 유효성 검사', () => {
  const getValidInput = () => {
    const today = new Date();
    const input: any = new CreateJobPostInput();
    input.title = '유효한 제목';
    input.userId = 'userId';
    input.jobCategories = [ReverseJobCategoryMapping[JobCategory.BAKING]];
    input.workPeriod = {
      type: ReverseWorkPeriodTypeMapping[WorkPeriodType.SHORT_TERM],
      dates: [format(today, 'yyyy-MM-dd')],
    };
    input.workTime = {
      type: ReverseWorkTimeTypeMapping[WorkTimeType.FIXED],
      startTime: '09:00',
      endTime: '17:00',
    };
    input.salary = {
      salaryType: ReverseSalaryTypeMapping[SalaryType.HOURLY],
      salaryAmount: 10000,
    };
    input.photos = ['http://example.com/photo1.jpg'];
    input.detailedDescription = '15자가 넘는 유효한 상세 설명입니다.';
    input.addressName = '동호로 97';
    return input;
  };

  it('올바른 입력값으로 유효성 검사 통과', async () => {
    const validInput = plainToClass(CreateJobPostInput, getValidInput());
    const errors = await validate(validInput);
    expect(errors.length).toBe(0);
  });

  it('제목이 6자 미만일 때 실패', async () => {
    const input = getValidInput();
    input.title = '짧은';
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('제목이 빈 공백으로 이루어져 있을 때 실패', async () => {
    const input = getValidInput();
    input.title = '      ';
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('제목이 30자를 초과할 때 실패', async () => {
    const input = getValidInput();
    input.title = 'a'.repeat(31);
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('하는 일 목록이 비어있을 때 실패', async () => {
    const input = getValidInput();
    input.jobCategories = [];
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('하는 일 목록이 3개를 초과할 때 실패', async () => {
    const input = getValidInput();
    input.jobCategories = [
      ReverseJobCategoryMapping[JobCategory.CLEANING],
      ReverseJobCategoryMapping[JobCategory.BAKING],
      ReverseJobCategoryMapping[JobCategory.BEVERAGE_MAKING],
      ReverseJobCategoryMapping[JobCategory.CONVENIENCE_STORE],
    ];
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('하는 일 목록이 중복일 때 실패', async () => {
    const input = getValidInput();
    input.jobCategories = [
      ReverseJobCategoryMapping[JobCategory.CLEANING],
      ReverseJobCategoryMapping[JobCategory.CLEANING],
    ];
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('단기 근무일 형식이 잘못될 때 실패', async () => {
    const input = getValidInput();
    input.workPeriod.dates = [format(new Date(), 'yyyy/MM/dd')];
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('단기 근무일이 한 달 이후일 때 실패', async () => {
    const input = getValidInput();
    input.workPeriod.dates = [
      format(addDays(addMonths(new Date(), 1), 1), 'yyyy-MM-dd'),
    ];
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('LONG_TERM 근무 유형일 때 요일이 없으면 실패', async () => {
    const input = getValidInput();
    input.workPeriod = {
      type: ReverseWorkPeriodTypeMapping[WorkPeriodType.LONG_TERM],
      days: [],
    };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('LONG_TERM 근무 유형일 때 요일 형식이 올바르지 않을 때 실패', async () => {
    const input = getValidInput();
    input.workPeriod = {
      type: ReverseWorkPeriodTypeMapping[WorkPeriodType.LONG_TERM],
      days: ['INVALID_DAY'],
    };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('SHORT_TERM 근무 유형일 때 요일이 있으면 실패', async () => {
    const input = getValidInput();
    input.workPeriod = {
      type: ReverseWorkPeriodTypeMapping[WorkPeriodType.SHORT_TERM],
      days: [ReverseDayOfWeekMapping['MONDAY']],
    };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('FIXED 근무 시간이 없을 때 실패', async () => {
    const input = getValidInput();
    input.workTime = {
      type: ReverseWorkTimeTypeMapping[WorkTimeType.FIXED],
    };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('시급이 최소 금액 미만일 때 실패', async () => {
    const input = getValidInput();
    input.salary.salaryAmount = 9000;
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('유효하지 않은 WorkPeriodType일 때 실패', async () => {
    const input = getValidInput();
    input.workPeriod = {
      type: 'INVALID_TYPE',
    };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('유효하지 않은 SalaryType일 때 실패', async () => {
    const input = getValidInput();
    input.salary = {
      salaryType: 'INVALID_TYPE',
      salaryAmount: 10000,
    };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('사진 URL이 잘못된 형식일 때 실패', async () => {
    const input = getValidInput();
    input.photos = ['invalid-url'];
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('사진 개수가 10개를 초과할 때 실패', async () => {
    const input = getValidInput();
    input.photos = new Array(11).fill('http://example.com/photo.jpg');
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('상세 설명이 15자 미만일 때 실패', async () => {
    const input = getValidInput();
    input.detailedDescription = '짧은 설명';
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('상세 설명이 2000자를 초과할 때 실패', async () => {
    const input = getValidInput();
    input.detailedDescription = 'a'.repeat(2001);
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('상세 설명이 빈 공백으로 이루어져 있을 때 실패', async () => {
    const input = getValidInput();
    input.detailedDescription = ' '.repeat(15);
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('근무 시간이 올바른 형식이 아닐 때 실패', async () => {
    const input = getValidInput();
    input.workTime.startTime = '0900';
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('근무 시간이 24시간 이상일 때 실패', async () => {
    const input = getValidInput();
    input.workTime.startTime = '24:00';
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });
});
