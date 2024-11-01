import { createStitches } from "@stitches/react";
import { MainColor, MainButtonStyle } from "../styles/global.ts";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "center",
});

const TopButtonStyle = {
  border: "none",
  background: "none",
  color: MainColor,
  cursor: "pointer",
  fontSize: "18px",
  position: "fixed",
  top: "20px",
};

export const CancelButton = styled("button", {
  ...TopButtonStyle,
  left: "20px",
});

export const LoadButton = styled("button", {
  ...TopButtonStyle,
  right: "20px",
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
    padding: "30px",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
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
    "& > .description": {
      fontSize: "16px",
      fontWeight: "400",
      color: "#6E6E6E",
      marginTop: "4px",
    },
  },
});

export const DescriptionSection = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "6px",
  position: "relative",
  "& textarea": {
    width: "100%",
    background: "white",
    border: "0.6px solid #343434",
    padding: "17px",
    fontSize: "18px",
    boxSizing: "border-box",
    borderRadius: "16px",
    lineHeight: "26px",
    fontFamily: "inherit",
    "&::placeholder": {
      fontSize: "18px",
      color: "#B2B2B2",
    },
    outline: "none",
    "&.invalid": {
      border: "2px solid #FF4043",
    },
    "&:focus": {
      border: `2px solid ${MainColor}`,
    },
  },
  "& #charCountInfo": {
    color: "#9A9A9A",
    fontWeight: "300",
    position: "absolute",
    bottom: "-27px",
    right: "0px",
    "& span": {
      color: "black",
      fontWeight: "400",
    },
  },
});

export const CreateButton = styled("button", {
  ...MainButtonStyle,
  width: "1000px",
  bottom: "20px",
  marginTop: "65px",
});
