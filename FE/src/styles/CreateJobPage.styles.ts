import { createStitches } from "@stitches/react";
import {
  MainColor,
  MainButtonStyle,
  NavigationBarHeight,
} from "../styles/global";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  paddingTop: NavigationBarHeight,
});

export const Container = styled("div", {
  width: "1000px",
});

export const FormSectionContainer = styled("div", {
  marginTop: "45px",
  width: "100%",
  "& > label": {
    fontSize: "20px",
    fontWeight: "900",
    marginBottom: "12px",
    display: "inline-block",
  },
  "& .content": {
    width: "100%",
    background: "white",
    border: "1px solid #E3E9ED",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    boxSizing: "border-box",
  },
});

export const FormFieldContainer = styled("div", {
  width: "100%",
  "& > label": {
    color: MainColor,
    fontSize: "20px",
    fontWeight: "900",
    marginBottom: "12px",
    display: "inline-block",
    "& span": {
      color: "#9A9A9A",
      fontWeight: "normal",
      fontSize: "18px",
    },
  },
});

export const TimeContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const PostButton = styled("button", {
  ...MainButtonStyle,
  width: "1000px",
  bottom: "20px",
  marginTop: "65px",
});
