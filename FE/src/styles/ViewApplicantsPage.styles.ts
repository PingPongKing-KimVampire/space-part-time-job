import { createStitches } from "@stitches/react";
import {
  MainButtonStyle,
  MainColor,
  NavigationBarHeight,
} from "../styles/global";

const { styled } = createStitches();

export const Container = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  paddingTop: `calc(${NavigationBarHeight} + 24px)`,
  paddingBottom: "30px",
});

export const Item = styled("div", {
  width: "700px",
  padding: "15px 20px",
  background: "white",
  borderRadius: "15px",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  "& .recruitmentBadge": {
    display: "flex",
    gap: "3px",
    fontWeight: "bold",
    color: MainColor,
    marginBottom: "6px",
    "& svg": {
      width: "20px",
      height: "20px",
      strokeWidth: "2",
    },
  },
  "& .userInfo": {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "8px",
    "& svg": {
      width: "42px",
      height: "42px",
      fill: MainColor,
    },
    "& .nickname": {
      fontSize: "20px",
      fontWeight: "600",
    },
    "& .applyTime": {
      fontSize: "15px",
      color: "#828282",
    },
  },
  "& .selfIntroduction": {
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "24px",
    marginBottom: "14px",
  },
  "& .recruitmentButton": {
    ...MainButtonStyle,
    fontSize: "20px",
    width: "100%",
    padding: "9px",
    borderRadius: "12px",
  },
});
