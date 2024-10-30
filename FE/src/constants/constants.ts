import formatCurrency from "../utils/formatCurrency.ts";

export const IP_ADDRESS = "localhost";

export const JOB_TYPES = [
  "서빙",
  "주방보조/설거지",
  "주방장/조리사",
  "매장관리/판매",
  "음료 제조",
  "베이킹",
  "업체 청소",
  "심부름/소일거리",
  "전단지 배포",
  "과외/학원",
  "등하원도우미",
  "아이돌봄",
  "어르신 돌봄",
  "가사/집정리",
  "짐 옮기기",
  "반려동물 돌봄",
  "편의점",
  "기타",
];

export const TERM = {
  TODAY: "오늘",
  TOMORROW: "내일",
  SHORT_TERM: "단기",
  LONG_TERM: "1개월 이상",
};

export const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

type PayTypes = {
  HOURLY: string;
  PER_UNIT: string;
  MONTHLY: string;
};
export const PAY_TYPES: PayTypes = {
  HOURLY: "시급",
  PER_UNIT: "건당",
  MONTHLY: "월급",
};

export const WORKTIME_TYPES = {
  NEGOTIABLE: "협의 가능",
  TIME_SETTING: "시간 설정",
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
