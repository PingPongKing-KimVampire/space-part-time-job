import { createStitches } from "@stitches/react";
import { MainColor, OptionHoverColor } from "../styles/global.ts";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const Container = styled("div", {
  width: "700px",
  display: "flex",
  flexDirection: "column",
});

export const SearchItemContent = styled("div", {
  width: "100%",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  "& .zipCode": {
    fontWeight: "500",
    fontSize: "18px",
    marginBottom: "5px",
  },
  "& .keyAndValue": {
    display: "flex",
    gap: "12px",
    "& .key, & .value": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .key": {
      width: "60px",
      borderRadius: "7px",
      padding: "3px",
      boxSizing: "border-box",
      background: OptionHoverColor,
      color: MainColor,
      transition: "background 0.2s",
    },
    "& .value": {
      fontWeight: "500",
    },
  },
  "&:hover": {
    "& .zipCode": {
      fontWeight: "600",
    },
    "& .keyAndValue": {
      "& .key": {
        background: MainColor,
        color: "white",
      },
      "& .value": {
        fontWeight: "700",
      },
    },
  },
});
