import formatCurrency from "../utils/formatCurrency.ts";

export const IP_ADDRESS = "localhost";

export const JOB_TYPES = {
  SERVING: "서빙",
  KITCHEN_ASSISTANT: "주방보조/설거지",
  COOK: "주방장/조리사",
  STORE_MANAGEMENT: "매장관리/판매",
  BEVERAGE_MAKING: "음료 제조",
  BAKING: "베이킹",
  CLEANING: "업체 청소",
  ERRAND: "심부름/소일거리",
  FLYER_DISTRIBUTION: "전단지 배포",
  TUTORING: "과외/학원",
  SCHOOL_PICKUP: "등하원도우미",
  CHILDCARE: "아이돌봄",
  SENIOR_CARE: "어르신 돌봄",
  HOUSEKEEPING: "가사/집정리",
  MOVING: "짐 옮기기",
  PET_CARE: "반려동물 돌봄",
  CONVENIENCE_STORE: "편의점",
  OTHERS: "기타",
};

export const TERM = {
  TODAY: "오늘",
  TOMORROW: "내일",
  SHORT_TERM: "단기",
  LONG_TERM: "1개월 이상",
};

export const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

type PayTypes = {
  HOURLY: string;
  PER_TASK: string;
  MONTHLY: string;
};
export const PAY_TYPES: PayTypes = {
  HOURLY: "시급",
  PER_TASK: "건당",
  MONTHLY: "월급",
};

export const WORKTIME_TYPES = {
  FLEXIBLE: "협의 가능",
  FIXED: "시간 설정",
};

export const SEND_AUTHNUMBER_COUNTDOWN_SEC = 300;

export const TIMES = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

export const MINIMUM_HOURLY_PAY = 9860;
