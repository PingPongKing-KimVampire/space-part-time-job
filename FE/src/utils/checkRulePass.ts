import {
  PAY_TYPES,
  MINIMUM_HOURLY_PAY,
  ERROR,
} from "../constants/constants.ts";

const checkRulePassCommon = {
  phoneNumber: (phoneNumber: string): boolean => {
    phoneNumber = phoneNumber.replaceAll("-", "");
    if (phoneNumber.length < 11) return false;
    if (phoneNumber.slice(0, 3) !== "010") return false;
    return /^[0-9]+$/.test(phoneNumber);
  },
};

export const checkRulePassInAuth = {
  id: (id: string): boolean => {
    if (id.length < 5 || 20 < id.length) return false;
    return /^[a-z0-9]+$/.test(id); // 영소문자/숫자만 포함되는가
  },
  password: (password: string): boolean => {
    if (password.length < 8 || 16 < password.length) return false;

    const hasOther = /[^a-zA-Z0-9~!?@#$%^&*()_\-+=<>,."'`;|/:\[\]{}\\]/.test(
      password
    );
    if (hasOther) return false; // 영문자, 숫자, 특수문자만 포함되는가

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[~!?@#$%^&*()_\-+=<>,."'`;|/:\[\]{}\\]/.test(
      password
    );
    const typesCount = [
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;
    return 3 <= typesCount; // 영대문자/영소문자/숫자/특수문자 중 최소 3종류가 포함되는가
  },
  nickname: (nickname: string): boolean => {
    if (nickname.length < 1 || 10 < nickname.length) return false;
    return /^[가-힣a-zA-Z0-9]+$/.test(nickname);
  },
  authNumber: (authNumber: string): boolean => {
    return authNumber.length > 0;
  },
  ...checkRulePassCommon,
};

export const checkRulePassInCreateJob = {
  title: (title: string): boolean => {
    return 6 <= title.length && title.length <= 30;
  },
  jobTypes: (jobTypes: string[]): boolean => {
    return 1 <= jobTypes.length && jobTypes.length <= 3;
  },
  weekDays: (weekDays: string[]): boolean => {
    return 1 <= weekDays.length;
  },
  // TODO : pay만 string 반환하는 거 일관성 무슨 일..?
  pay: (type: string, amount: string): string => {
    if (amount.length === 0) return ERROR.CREATE_JOB.FOLLOW_PAY_RULE;
    if (
      type === PAY_TYPES.HOURLY &&
      parseInt(amount.replaceAll(",", "")) < MINIMUM_HOURLY_PAY
    )
      return ERROR.CREATE_JOB.FOLLOW_PAY_HOURLY_RULE;
    return "";
  },
  description: (description: string): boolean => {
    return 15 <= description.length && description.length <= 2000;
  },
  ...checkRulePassCommon,
};
