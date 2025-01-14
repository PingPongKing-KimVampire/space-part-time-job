const formatTimeAgo = (iso: string): string => {
  const now = new Date();
  const target = new Date(iso);
  const diffSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  const minute = 60; // 분 당 초
  const hour = minute * 60; // 시 당 초
  const day = hour * 24; // 일 당 초

  if (diffSeconds <= 0) {
    return "방금";
  } else if (diffSeconds < minute) {
    return `${diffSeconds}초`;
  } else if (diffSeconds < hour) {
    return `${Math.floor(diffSeconds / minute)}분`;
  } else if (diffSeconds < day) {
    return `${Math.floor(diffSeconds / hour)}시간`;
  }
  return `${Math.floor(diffSeconds / day)}일`;
};

export default formatTimeAgo;
