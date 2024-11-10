export enum JobCategory {
  SERVING = 'SERVING', // 서빙
  KITCHEN_ASSISTANT = 'KITCHEN_ASSISTANT', // 주방보조/설거지
  CHEF = 'CHEF', // 주방장/조리사
  STORE_MANAGEMENT = 'STORE_MANAGEMENT', // 매장관리/판매
  BEVERAGE_MAKING = 'BEVERAGE_MAKING', // 음료 제조
  BAKING = 'BAKING', // 베이킹
  CLEANING = 'CLEANING', // 업체 청소
  ERRANDS = 'ERRANDS', // 심부름/소일거리
  FLYER_DISTRIBUTION = 'FLYER_DISTRIBUTION', // 전단지 배포
  TUTORING = 'TUTORING', // 과외/학원
  SCHOOL_PICKUP_HELPER = 'SCHOOL_PICKUP_HELPER', // 등하원도우미
  CHILD_CARE = 'CHILD_CARE', // 아이돌봄
  ELDER_CARE = 'ELDER_CARE', // 어르신 돌봄
  HOUSEKEEPING = 'HOUSEKEEPING', // 가사/집정리
  MOVING_ASSISTANCE = 'MOVING_ASSISTANCE', // 짐 옮기기
  PET_CARE = 'PET_CARE', // 반려동물 돌봄
  CONVENIENCE_STORE = 'CONVENIENCE_STORE', // 편의점
  OTHER = 'OTHER', // 기타
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum WorkPeriodType {
  SHORT_TERM = 'SHORT_TERM', // 단기
  LONG_TERM = 'LONG_TERM', // 1개월 이상
}

export enum WorkTimeType {
  FLEXIBLE = 'FLEXIBLE', // 협의 가능
  FIXED = 'FIXED', // 고정 시간
}

export enum SalaryType {
  HOURLY = 'HOURLY', // 시급
  PER_TASK = 'PER_TASK', // 건당
  MONTHLY = 'MONTHLY', // 월급
}
