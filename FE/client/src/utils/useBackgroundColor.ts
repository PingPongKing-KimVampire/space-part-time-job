import { useEffect } from "react";

const useBackgroundColor = (color) => {
  useEffect(() => {
    // 마운트 시 배경색 변경
    document.body.style.background = color;
    return () => {
      document.body.style.background = "white";
    };
  }, [color]);
};

export default useBackgroundColor;
