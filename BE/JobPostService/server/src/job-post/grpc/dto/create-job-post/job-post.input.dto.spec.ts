import "reflect-metadata"; //없으면 테스트시 Reflect.getMetadata is not a function 오류가 생김

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

describe('CreateJobPostInput 유효성 검사', () => {
  const getValidInput = () => {
    const today = new Date();
    const input = new CreateJobPostInput();
    input.title = '유효한 제목';
    input.jobDescription = [JobCategory.CLEANING];
    input.workPeriod = {
      type: WorkPeriodType.SHORT_TERM,
      dates: [format(today, 'yyyy-MM-dd')],
    };
    input.workTime = {
      type: WorkTimeType.FIXED,
      startTime: '09:00',
      endTime: '17:00',
    };
    input.salary = {
      salaryType: SalaryType.HOURLY,
      salaryAmount: 10000,
    };
    input.photos = ['http://example.com/photo1.jpg'];
    input.detailedDescription = '15자가 넘는 유효한 상세 설명입니다.';
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

  it('제목이 30자를 초과할 때 실패', async () => {
    const input = getValidInput();
    input.title = 'a'.repeat(31);
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('하는 일 목록이 비어있을 때 실패', async () => {
    const input = getValidInput();
    input.jobDescription = [];
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('하는 일 목록이 3개를 초과할 때 실패', async () => {
    const input = getValidInput();
    input.jobDescription = [
      JobCategory.CLEANING,
      JobCategory.BAKING,
      JobCategory.BEVERAGE_MAKING,
      JobCategory.CONVENIENCE_STORE,
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
    input.workPeriod = { type: WorkPeriodType.LONG_TERM, days: [] };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('LONG_TERM 근무 유형일 때 요일 형식이 올바르지 않을 때 실패', async () => {
    const input = getValidInput();
    input.workPeriod = {
      type: WorkPeriodType.LONG_TERM,
      days: ['INVALID_DAY'],
    };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('SHORT_TERM 근무 유형일 때 요일이 있으면 실패', async () => {
    const input = getValidInput();
    input.workPeriod = { type: WorkPeriodType.SHORT_TERM, days: ['MONDAY'] };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('FIXED 근무 시간이 없을 때 실패', async () => {
    const input = getValidInput();
    input.workTime = { type: WorkTimeType.FIXED };
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
    input.workPeriod = { type: 'INVALID_TYPE' as WorkPeriodType };
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('유효하지 않은 SalaryType일 때 실패', async () => {
    const input = getValidInput();
    input.salary = {
      salaryType: 'INVALID_TYPE' as SalaryType,
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

  it('근무 시간이 올바른 형식이 아닐 때 실패', async () => {
    const input = getValidInput();
    input.workTime.startTime = '0900';
    const transformedInput = plainToClass(CreateJobPostInput, input);
    const errors = await validate(transformedInput);
    expect(errors.length).toBeGreaterThan(0);
  });
});
