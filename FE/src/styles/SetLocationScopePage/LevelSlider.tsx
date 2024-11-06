import { createStitches } from "@stitches/react";
import { MainColor } from "../../styles/global.ts";

const { styled } = createStitches();

export const Container = styled("div", {
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  marginBottom: "28px",
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

export const Slider = styled("input", {
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
});
