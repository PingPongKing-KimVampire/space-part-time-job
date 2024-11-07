import { createStitches } from "@stitches/react";
import { MainColor, OptionHoverColor } from "../../styles/global.ts";

const { styled } = createStitches();

export const Container = styled("div", {
  width: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  marginTop: "-30px",
  "& .title": {
    fontSize: "20px",
    fontWeight: "bold",
    padding: "15px",
  },
});

export const Calendar = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  "& > *": {
    width: "calc(100% / 7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  "& .weekDay": {
    padding: "4px",
    fontSize: "15px",
    color: "#9A9A9A",
  },
});

export const DateItem = styled("button", {
  borderRadius: "100px",
  padding: "12px",
  fontSize: "18px",
  border: "none",
  background: "none",
  transitionProperty: "background border-radius",
  transitionDuration: "0.2s",
  "&.selectable": {
    cursor: "pointer",
    "&.sunday": {
      color: "#BD2A2E",
    },
    "&:hover": {
      background: OptionHoverColor,
    },
    "&.selected": {
      background: MainColor,
      color: "white",
      "&.rightSelected": {
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
      },
      "&.leftSelected": {
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
      },
    },
  },
  "&:not(.selectable)": {
    color: "#9A9A9A",
    cursor: "not-allowed",
  },
});
