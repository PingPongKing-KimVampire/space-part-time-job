import { useState, useRef } from "react";

// 초 단위 카운트다운에 유용한 타이머
const useCountdownTimer = (initialSeconds) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간을 초로 저장
  const intervalID = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (isActive && intervalID.current) {
      // 이전에 돌던 타이머가 있다면 종료시키고 재시작
      clearInterval(intervalID.current);
    }
    setTimeLeft(initialSeconds);
    setIsActive(true);
    intervalID.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          if (intervalID.current) clearInterval(intervalID.current!);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    setIsActive(false);
    if (intervalID.current) {
      clearInterval(intervalID.current);
    }
  };

  return {
    timeLeft,
    isActive,
    start,
    stop,
  };
};

export default useCountdownTimer;
