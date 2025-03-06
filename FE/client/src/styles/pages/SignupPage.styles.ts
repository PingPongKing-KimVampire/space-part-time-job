import { styled, MainButtonStyle } from "../global";

export const Background = styled("div", {
  width: "100%",
  flex: "1",
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
  "@bp3": {
    width: "85%",
  },
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
  "@bp3": {
    padding: "13px",
    fontSize: "21px",
  },
  "@bp2": {
    padding: "12px",
    fontSize: "20px",
  },
});

export const SignupButton = styled("button", {
  ...MainButtonStyle,
  margin: "30px 0",
  "@bp3": {
    padding: "13px",
    fontSize: "21px",
  },
  "@bp2": {
    padding: "12px",
    fontSize: "20px",
  },
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
