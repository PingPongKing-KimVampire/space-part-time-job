import {
  PAY_TYPES,
  WORKTIME_TYPES,
  DAYS,
  PERIOD,
} from "../constants/constants.ts";
import formatCurrency from "./formatCurrency.ts";
import { format, isToday, isTomorrow, min, max } from "date-fns";
import sortDays from "./sortDays.ts";

export const formatPayForDisplay = (pay: {
  type: string;
  amount: number;
}): string => {
  const isMonthly = PAY_TYPES[pay.type] === PAY_TYPES.MONTHLY;
  let unit: string, amount: string;
  if (isMonthly) {
    unit = "만원";
    amount = formatCurrency(pay.amount / 10000);
  } else {
    unit = "원";
    amount = formatCurrency(pay.amount);
  }
  return `${PAY_TYPES[pay.type]} ${amount}${unit}`;
};

export const formatTimeForDisplay = (time: {
  type: string;
  startTime?: string;
  endTime?: string;
}): string => {
  if (WORKTIME_TYPES[time.type] === WORKTIME_TYPES.FIXED)
    return `${time.startTime}~${time.endTime}`;
  return "시간 협의 가능";
};

export const formatPeriodForDisplay = (period: {
  type: string;
  dates?: string[];
  days?: string[];
}): string => {
  const formatDaysForDisplay = (days: string[]): string => {
    if (days.length === 0) return "";
    if (days.length === 1) return DAYS[days[0]];
    // 요일이 모두 연속된 경우
    const daysKeys = Object.keys(DAYS);
    const indexs = days.map((day) => daysKeys.findIndex((d) => d === day));
    indexs.sort();
    const isContinuous = indexs.every((index, idx, arr) => {
      if (idx === arr.length - 1) return true;
      return index + 1 === arr[idx + 1];
    });
    const daysValues = Object.values(DAYS);
    if (isContinuous)
      return `${daysValues[indexs[0]]}~${
        daysValues[indexs[indexs.length - 1]]
      }`;
    return sortDays(days.map((day) => DAYS[day])).join(", "); // 요일이 연속되지 않은 경우
  };
  const formatDatesForDisplay = (dates: string[]): string => {
    if (dates.length === 0) return "";
    if (dates.length === 1) {
      const dateObj = new Date(dates[0]);
      if (isToday(dateObj)) return "오늘";
      if (isTomorrow(dateObj)) return "내일";
      return format(dateObj, "M월 d일");
    }
    const dateObjs = dates.map((date) => new Date(date));
    const minDate = format(min(dateObjs), "M월 d일");
    const maxDate = format(max(dateObjs), "M월 d일");
    return `총 ${dates.length}일 / ${minDate}~${maxDate} 중`;
  };
  // 1개월 이상인 경우 요일 가공
  if (PERIOD[period.type] === PERIOD.LONG_TERM)
    return formatDaysForDisplay(period.days || []);
  // 단기인 경우 날짜 가공
  return formatDatesForDisplay(period.dates || []);
};
