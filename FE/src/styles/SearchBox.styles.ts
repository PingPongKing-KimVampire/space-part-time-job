import { createStitches } from "@stitches/react";
import { OptionButtonStyle } from "./global.ts";

const { styled } = createStitches();

export const Container = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
});

export const ResultBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  overflow: "scroll",
  "& .searchItem": {
    textAlign: "left",
    ...OptionButtonStyle,
  },
});
