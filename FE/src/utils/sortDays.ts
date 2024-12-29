import { DAYS } from "../constants/constants.ts";

// 요일 정렬 함수
const sortDays = (days: string[]) => {
  console.log("days", days);
  const daysValues = Object.values(DAYS);
  return days.sort((a, b) => daysValues.indexOf(a) - daysValues.indexOf(b));
};

export default sortDays;
