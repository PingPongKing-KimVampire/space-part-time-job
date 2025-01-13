import { createStitches } from "@stitches/react";
import { MainColor } from "../global";

const { styled } = createStitches();

export const Container = styled("div", {
  position: "relative",
  width: "100%",
});

export const Textarea = styled("textarea", {
  width: "100%",
  background: "white",
  border: "0.6px solid #343434",
  padding: "17px",
  fontSize: "18px",
  boxSizing: "border-box",
  borderRadius: "16px",
  lineHeight: "26px",
  fontFamily: "inherit",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "&::placeholder": {
    fontSize: "18px",
    color: "#B2B2B2",
  },
  "&:focus": {
    outline: `1px solid ${MainColor}`,
  },
});

export const CharCounter = styled("div", {
  position: "absolute",
  bottom: "-20px",
  right: "0px",
  color: "#9A9A9A",
  fontWeight: "300",
  "& span": {
    color: "black",
    fontWeight: "400",
  },
});
