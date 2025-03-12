import { styled, MainColor } from "../global";

export const Container = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  "& .sliderContainer": {
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  "& .labels": {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    "& .label": {
      fontSize: "13px",
      color: "#7C7C7C",
    },
  },
  "@bp2": {
    gap: "15px",
    "& .labels .label": {
      fontSize: "12px",
    },
  },
  "@bp1": {
    gap: "13px",
    "& .labels .label": {
      fontSize: "12px",
    },
  },
});

export const Slider = styled("input", {
  "-webkit-appearance": "none", // Chrome, Safari, Edge
  "-moz-appearance": "none", // Firefox
  "-ms-appearance": "none", // IE
  width: "100%",
  height: "5px",
  background: "#EDEDED",
  margin: "0",
  zIndex: "1",
  // Chrome, Safari, Edge
  "&::-webkit-slider-thumb": {
    "-webkit-appearance": "none",
    width: "24px",
    height: "24px",
    background: MainColor,
    cursor: "pointer",
    borderRadius: "20px",
  },
  // Firefox
  "&::-moz-range-thumb": {
    width: "24px",
    height: "24px",
    background: MainColor,
    cursor: "pointer",
    borderRadius: "20px",
    border: "none", // 기본 스타일 제거
  },
  // IE
  "&::-ms-thumb": {
    width: "24px",
    height: "24px",
    background: MainColor,
    cursor: "pointer",
    borderRadius: "20px",
    border: "none",
  },
  "&::-ms-track": {
    width: "100%",
    height: "5px",
    background: "transparent", // 기본 트랙 스타일 제거
    borderColor: "transparent",
    color: "transparent",
  },
  "@bp2": {
    height: "4px",
    "&::-webkit-slider-thumb": {
      width: "20px",
      height: "20px",
    },
  },
});

export const MarkersContainer = styled("div", {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  left: "0",
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  pointerEvents: "none",
  zIndex: "0",
  "& .marker": {
    width: "17px",
    height: "17px",
    background: "#EDEDED",
    borderRadius: "10px",
  },
  "@bp2": {
    "& .marker": {
      width: "15px",
      height: "15px",
    },
  },
});
