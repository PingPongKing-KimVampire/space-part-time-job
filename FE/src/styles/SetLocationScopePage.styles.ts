import { createStitches } from "@stitches/react";
import {
  MainButtonStyle,
  MainColor,
  OptionButtonStyle,
} from "../styles/global.ts";

export const { styled } = createStitches();

export const Background = styled("div", {
  background: "white",
  height: "100%",
  width: "100%",
  position: "relative",
  "& .mapContainer": {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    zIndex: "0",
  },
});

export const Container = styled("div", {
  width: "700px",
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
});

export const ScopeSettingContainer = styled("div", {
  width: "100%",
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #E3E9ED",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  boxSizing: "border-box",
  marginBottom: "20px",
});

export const LocationsContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  gap: "7px",
  height: "55px",
  marginBottom: "28px",
  "& .locationButton": {
    ...OptionButtonStyle,
    textAlign: "left",
    borderRadius: "9px",
    width: "calc((100% - 14px) / 3)",
    "& svg": {
      position: "absolute",
      height: "50%",
      strokeWidth: "1",
      top: "50%",
      transform: "translateY(-50%)",
      right: "10px",
    },
    "&:not(.selected)": {
      "& svg": {
        color: MainColor,
      },
    },
  },
});

export const PlusButton = styled("button", {
  padding: "16px",
  cursor: "pointer",
  background: "#EDEDED",
  color: "#B0B0B0",
  borderRadius: "9px",
  width: "calc((100% - 14px) / 3)",
  border: `0.9px solid #EDEDED`,
  position: "relative",
  "& svg": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateY(-50%) translateX(-50%)",
    height: "60%",
    strokeWidth: "1.3",
    color: "#7C7C7C",
  },
  transition: "background 0.2s",
  "&:hover": {
    background: "#E4E4E4",
  },
});

export const SliderContainer = styled("div", {
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  marginBottom: "28px",
  "& .markers": {
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
  },
  "& .label": {
    fontSize: "13px",
    color: "#7C7C7C",
    position: "absolute",
    bottom: "-32px",
    "&.left": {
      left: "0",
    },
    "&.right": {
      right: "0",
    },
  },
});

export const ScopeSlider = styled("input", {
  width: "100%",
  "-webkit-appearance": "none",
  height: "5px",
  background: "#EDEDED",
  "&::-webkit-slider-thumb": {
    "-webkit-appearance": "none",
    appearance: "none",
    width: "24px",
    height: "24px",
    background: MainColor,
    cursor: "pointer",
    borderRadius: "20px",
    position: "relative",
    zIndex: "1",
  },
});

export const CompleteButton = styled("button", {
  width: "100%",
  ...MainButtonStyle,
});