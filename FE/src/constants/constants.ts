import formatCurrency from "../utils/formatCurrency";

export const IP_ADDRESS = "localhost";

export const ERROR = {
  SERVER: "* 서버가 불안정합니다. 나중에 다시 시도해주세요.",
  NETWORK: "* 네트워크 오류가 발생했습니다. 나중에 시도해주세요.",
  AUTH_NUMBER_SEND_COUNT_EXCEED:
    "* 하루 최대 인증번호 전송 횟수를 초과하셨습니다.",
  INVALID_AUTH_NUMBER: "* 인증번호가 유효하지 않습니다.",
  INVALID_PHONE_NUMBER: "* 휴대폰 번호가 유효하지 않습니다.",
  LOGIN: {
    INVALID_ID_PW: "* 아이디 또는 비밀번호가 유효하지 않습니다.",
    PHONE_NUMBER_NOT_EXIST: "* 가입되지 않은 휴대폰 번호입니다.",
    ENTER_PHONE_NUMBER: "* 휴대폰 번호를 입력해주세요.",
    ENTER_ID: "* 휴대폰 번호를 입력해주세요.",
    ENTER_PW: "* 비밀번호를 입력해주세요.",
    ENTER_AUTH_NUMBER: "* 인증번호를 입력해 주세요.",
  },
  SIGNUP: {
    DUPLICATED_PHONE_NUMBER: "* 이미 가입된 휴대폰 번호입니다.",
    DUPLICATED_ID: "* 중복되는 아이디입니다.",
    DUPLICATED_NICKNAME: "* 중복되는 닉네임입니다.",
    FOLLOW_ID_RULE: "* 아이디는 5~20자의 영문 소문자, 숫자를 사용해 주세요.",
    FOLLOW_PW_RULE:
      "* 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.",
    FOLLOW_NICKNAME_RULE:
      "* 닉네임은 1~10자의 한글, 영문, 숫자를 사용해 주세요.",
  },
  CREATE_JOB: {
    FOLLOW_TITLE_RULE: "* 최소 6자에서 최대 30자까지 입력할 수 있어요.",
    FOLLOW_JOB_TYPES_RULE: "* 하는 일은 1개 이상, 3개 이하로 선택할 수 있어요.",
    FOLLOW_WEEKDAYS_RULE: "* 요일을 1개 이상 선택해 주세요.",
    FOLLOW_DATES_RULE: "* 날짜를 1일 이상 선택해 주세요.",
    FOLLOW_PAY_RULE: "* 급여를 입력해 주세요.",
    FOLLOW_PAY_HOURLY_RULE:
      "* 최저임금을 준수해주세요. 2024년 최저시급은 9,860원입니다.",
    FOLLOW_DESCRIPTION_RULE:
      "* 최소 15자에서 최대 2000자까지 입력할 수 있어요.",
    FOLLOW_IMAGE_SIZE_COUNT_RULE:
      "* 10MB 이하의 사진 10장까지 업로드 가능합니다.",
    FOLLOW_IMAGE_SIZE_RULE: "* 10MB 이하의 사진만 가능합니다.",
    FOLLOW_IMAGE_COUNT_RULE: "* 사진은 10장까지만 가능합니다",
  },
};

export enum LOGIN_TAB {
  ID_PW = "ID_PW",
  PHONE_NUMBER = "PHONE_NUMBER",
}

const reverseKeyValue = (object: { [key: string]: string }) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
};

export const JOB_TYPES = {
  SERVING: "서빙",
  KITCHEN_ASSISTANT: "주방보조/설거지",
  CHEF: "주방장/조리사",
  STORE_MANAGEMENT: "매장관리/판매",
  BEVERAGE_MAKING: "음료 제조",
  BAKING: "베이킹",
  CLEANING: "업체 청소",
  ERRANDS: "심부름/소일거리",
  FLYER_DISTRIBUTION: "전단지 배포",
  TUTORING: "과외/학원",
  SCHOOL_PICKUP_HELPER: "등하원도우미",
  CHILD_CARE: "아이돌봄",
  ELDER_CARE: "어르신 돌봄",
  HOUSEKEEPING: "가사/집정리",
  MOVING_ASSISTANCE: "짐 옮기기",
  PET_CARE: "반려동물 돌봄",
  CONVENIENCE_STORE: "편의점",
  OTHER: "기타",
};
export const JOB_TYPES_KEY = reverseKeyValue(JOB_TYPES);

export const TERM = {
  TODAY: "오늘",
  TOMORROW: "내일",
  SHORT_TERM: "단기",
  LONG_TERM: "1개월 이상",
};
export const TERM_KEY = reverseKeyValue(TERM);

export const DAYS = {
  SUNDAY: "일",
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
};
export const DAYS_KEY = reverseKeyValue(DAYS);

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
export const PAY_TYPES_KEY = reverseKeyValue(PAY_TYPES);

export const WORKTIME_TYPES = {
  FLEXIBLE: "협의 가능",
  FIXED: "시간 설정",
};
export const WORKTIME_TYPES_KEY = reverseKeyValue(WORKTIME_TYPES);

export const SEND_SMSCODE_COUNTDOWN_SEC = 300;

const TIMES = [
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
export const START_TIMES = ["00:00", ...TIMES];
export const END_TIMES = [...TIMES, "24:00"];

export const TIME_NOT_SET = "-";

export const MINIMUM_HOURLY_PAY = 9860;

// export const APPLICATION_STATUS = {
//   PENDING: "대기 중",
//   ACCEPTED: "채용 확정",
//   REJECTED: "채용 거절",
//   CANCELED: "사용자 취소",
// };

export enum APPLICATION_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export enum JOB_POST_STATUS {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
}
