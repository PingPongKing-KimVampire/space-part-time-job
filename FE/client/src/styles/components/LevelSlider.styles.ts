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
  "-webkit-appearance": "none",
  width: "100%",
  height: "5px",
  background: "#EDEDED",
  margin: "0",
  "&::-webkit-slider-thumb": {
    "-webkit-appearance": "none",
    width: "24px",
    height: "24px",
    background: MainColor,
    cursor: "pointer",
    borderRadius: "20px",
    position: "relative",
    zIndex: "1",
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
