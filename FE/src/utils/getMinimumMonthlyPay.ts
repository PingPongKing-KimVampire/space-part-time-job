import { MINIMUM_HOURLY_PAY } from "../constants/constants.ts";

// 근무 요일, 근무 시작/끝 시간 -> 최소 월급 계산
const getMinimumMonthlyPay = (
  days: string[],
  time: { start: string; end: string }
) => {
  const weekDayCount = days.length; // 주간 근무 일수
  const [startH, startM] = time.start.split(":").map(Number);
  const [endH, endM] = time.end.split(":").map(Number);
  let dailyHours = (endM + endH * 60 - (startM + startH * 60)) / 60; // 1일 근로 시간
  if (dailyHours < 0) dailyHours += 24;
  const weeklyHours = dailyHours * weekDayCount; // 주간 근로 시간
  const monthlyHours = weeklyHours * 4; // 월간 근로 시간
  let monthlyPay = monthlyHours * MINIMUM_HOURLY_PAY; // 주휴수당 제외 월급
  if (weeklyHours >= 15) {
    // 아르바이트는 주간 근로 시간이 15시간 이상인 경우에 주휴수당 지급
    if (weeklyHours >= 40) {
      // 주 40시간 이상 근무 : 1일 근로시간 X 시급
      monthlyPay += dailyHours * MINIMUM_HOURLY_PAY * 4;
    } else {
      // 주 40시간 미만 근무 : 일주일 근로시간 X 8 / 40 X 시급
      monthlyPay += ((weeklyHours * 8) / 40) * MINIMUM_HOURLY_PAY * 4;
    }
  }
  return { monthlyPay, weekDayCount, dailyHours };
};

export default getMinimumMonthlyPay;
