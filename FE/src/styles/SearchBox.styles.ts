import { createStitches } from "@stitches/react";
import { OptionButtonStyle } from "./global.ts";

const { styled } = createStitches();

export const Container = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const ContentBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  "& .searchItem": {
    ...OptionButtonStyle,
    width: "100%",
    textAlign: "left",
    marginBottom: "10px",
  },
});

export const FixedBox = styled("div", {
  display: "flex",
  gap: "8px",
  transition: "all 0.2s",
  height: "0",
  opacity: "0",
  "&.visible": {
    height: "auto",
    opacity: "1",
    marginTop: "14px",
  },
});

export const ResultBox = styled("div", {
  marginTop: "16px",
});
