import { createStitches } from "@stitches/react";
import {
  MainButtonStyle,
  MainColor,
  NavigationBarHeight,
  NegativeColor,
  NegativeHoverColor,
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
  "& .item": {
    width: "700px",
    padding: "15px 20px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
    "& .coverLetter": {
      fontSize: "15px",
      fontWeight: "400",
      lineHeight: "24px",
    },
    "& .changeStatusButtons": {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      marginTop: "16px",
      "& button": {
        ...MainButtonStyle,
        fontSize: "20px",
        width: "49.2%",
        padding: "9px",
        borderRadius: "12px",
        "&.rejectButton": {
          background: NegativeColor,
          "&:hover": {
            background: NegativeHoverColor,
          },
        },
      },
    },
  },
});

export const Badge = styled("div", {
  display: "flex",
  gap: "3px",
  fontWeight: "bold",
  marginBottom: "6px",
  "&.accepted": {
    color: MainColor,
  },
  "&.rejected": {
    color: NegativeColor,
  },
  "& svg": {
    width: "20px",
    height: "20px",
    strokeWidth: "2",
  },
});

export const UserInfo = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
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
  "& .createdAt": {
    fontSize: "15px",
    color: "#828282",
  },
});
