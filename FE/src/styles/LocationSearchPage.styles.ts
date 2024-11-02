import { createStitches } from "@stitches/react";
import {
  MainButtonStyle,
  MainColor,
  MainHoverColor,
} from "../styles/global.ts";

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
    border: `0.9px solid ${MainColor}`,
    background: "white",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "left",
    transition: "background 0.2s",
    "&:hover": {
      background: "#DCE2FF",
      borderColor: "#DCE2FF",
    },
    "&.selected": {
      background: MainColor,
      borderColor: MainColor,
      color: "white",
      "&:hover": {
        background: MainHoverColor,
        borderColor: MainHoverColor,
      },
    },
  },
});

export const NextButton = styled("button", {
  width: "100%",
  marginTop: "10px",
  ...MainButtonStyle,
});
