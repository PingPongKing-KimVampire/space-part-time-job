import { createStitches } from "@stitches/react";
import { activatedButton, inactivatedButton } from "./global.ts";
const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const Container = styled("div", {
  width: "550px",
  marginTop: "40px",
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
  ...activatedButton,
  width: "100%",
});

export const SignupButton = styled("button", {
  width: "550px",
  marginTop: "180px",
  "&.activated": activatedButton,
  "&.inactivated": inactivatedButton,
});

export const WarningText = styled("div", {
  marginTop: "10px",
  color: "#FF4043",
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

export const NotificationBox = styled("div", {
  position: "fixed",
  bottom: "30px",
  background: "black",
  color: "white",
  width: "550px",
  padding: "16px",
  borderRadius: "10px",
  boxSizing: "border-box",
});
