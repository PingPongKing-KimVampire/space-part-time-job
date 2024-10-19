import { MainColor, MainButtonStyle } from "../styles/global.ts";
import { createStitches } from "@stitches/react";
const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "60px",
});

export const Title = styled("div", {
  marginBottom: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  "& .sub": {
    fontSize: "24px",
    fontWeight: "400",
    span: {
      color: MainColor,
    },
  },
  "& .main": {
    fontSize: "50px",
    fontWeight: "900",
    color: MainColor,
  },
});

export const LoginPanel = styled("div", {
  width: "500px",
});

export const TabButton = styled("button", {
  width: "50%",
  padding: "18px",
  fontSize: "20px",
  fontWeight: "600",
  border: "1px solid #CDD2D7",
  background: "#F8F8F8",
  color: "#7C7C7C",
  cursor: "pointer",
  "&.left": {
    borderTopLeftRadius: "10px",
    borderRight: "none",
  },
  "&.right": {
    borderTopRightRadius: "10px",
  },
  "&.selected": {
    borderBottom: "none",
    background: "white",
    color: "black",
  },
});

export const LoginForm = styled("form", {
  padding: "36px 32px 30px 32px",
  background: "white",
  border: "1px solid #CDD2D7",
  borderTop: "none",
  borderRadius: "0 0 10px 10px",
});

export const SendNumberButton = styled("button", {
  ...MainButtonStyle,
  padding: "7px 10px",
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
});

export const LoginButton = styled("button", {
  ...MainButtonStyle,
  width: "100%",
  marginTop: "24px",
});

export const SignupMessage = styled("div", {
  marginTop: "20px",
  color: "#707070",
  "& span": {
    color: MainColor,
    cursor: "pointer",
  },
});
