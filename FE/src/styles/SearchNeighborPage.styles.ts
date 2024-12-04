import { createStitches } from "@stitches/react";
import { MainButtonStyle, OptionButtonStyle } from "./global.ts";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const Container = styled("div", {
  width: "700px",
  display: "flex",
  flexDirection: "column",
  "& .title": {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "40px",
    width: "100%",
    textAlign: "center",
  },
  "& .content": {
    display: "flex",
    flexDirection: "column",
  },
});

const itemStyle = {
  ...OptionButtonStyle,
  width: "100%",
  textAlign: "left",
  marginBottom: "10px",
};

export const SelectedContainer = styled("div", {
  display: "flex",
  gap: "8px",
  transition: "margin-top 0.2s",
  height: "0",
  opacity: "0",
  "&.visible": {
    height: "auto",
    opacity: "1",
    marginTop: "14px",
  },
  "& .searchItem": itemStyle,
});

export const ResultContainer = styled("div", {
  marginTop: "16px",
  "& .searchItem": itemStyle,
});

export const NextButton = styled("button", {
  width: "100%",
  marginTop: "30px",
  ...MainButtonStyle,
  "& .selectedCount": {
    fontSize: "18px",
    fontWeight: "400",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: "20px",
  },
});
