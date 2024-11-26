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
});

const ListBoxStyle = {
  display: "flex",
  flexDirection: "column",
  "& .searchItem": {
    textAlign: "left",
    ...OptionButtonStyle,
  },
};

export const FixedBox = styled("div", {
  ...ListBoxStyle,
  gap: "8px",
  marginTop: "14px",
});

export const ResultBox = styled("div", {
  ...ListBoxStyle,
  overflow: "scroll",
  gap: "12px",
  marginTop: "24px",
});
