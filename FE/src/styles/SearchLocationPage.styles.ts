import { createStitches } from "@stitches/react";
import { MainButtonStyle, MainColor, MainHoverColor } from "./global.ts";

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
  "& .searchContainer": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
});

export const SearchResultBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  height: "420px",
  overflow: "scroll",
  marginBottom: "30px",
  "& .searchItem": {
    padding: "17px",
    borderRadius: "16px",
    fontSize: "16px",
    textAlign: "left",
    transition: "background 0.2s",
    "&.selected": {
      background: MainColor,
      border: `0.9px solid ${MainColor}`,
      color: "white",
      "&:hover": {
        background: MainHoverColor,
        borderColor: MainHoverColor,
      },
    },
    "&:not(.selected)": {
      "&:not(.inactivated)": {
        border: `0.9px solid ${MainColor}`,
        background: "white",
        cursor: "pointer",
        "&:hover": {
          background: "#DCE2FF",
          borderColor: "#DCE2FF",
        },
      },
      "&.inactivated": {
        background: "#EDEDED",
        color: "#B0B0B0",
        cursor: "not-allowed",
        border: `0.9px solid #EDEDED`,
      },
    },
  },
});

export const NextButton = styled("button", {
  width: "100%",
  marginTop: "10px",
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
