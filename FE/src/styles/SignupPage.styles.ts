import { createStitches } from "@stitches/react";
import { MainButtonStyle } from "./global.ts";
const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const Container = styled("div", {
  width: "700px",
  marginTop: "60px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "",
});

export const PhoneNumberContainer = styled("div", {
  marginTop: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const SendNumberButton = styled("button", {
  ...MainButtonStyle,
  width: "100%",
});

export const SignupButton = styled("button", {
  ...MainButtonStyle,
  width: "700px",
  position: "absolute",
  bottom: "30px",
});

export const TimeCounter = styled("div", {
  position: "absolute",
  right: "20px",
  top: "50%",
  transform: "translateY(-50%)",
  fontWeight: "400",
  fontSize: "20px",
  letterSpacing: "1px",
});
