import { createStitches } from "@stitches/react";
import { MainColor, OptionHoverColor } from "./global.ts";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
});

export const Container = styled("div", {
  width: "1000px",
  marginTop: "40px",
});

export const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "25px",
  "& .jobTypesContainer": {
    display: "flex",
    gap: "6px",
    "& .jobType": {
      color: MainColor,
      border: `1px solid ${MainColor}`,
      padding: "4px 9px",
      background: OptionHoverColor,
      borderRadius: "10px",
      fontWeight: "500",
      fontSize: "13px",
    },
  },
  "& .title": {
    fontSize: "24px",
    fontWeight: "bold",
  },
  "& .postTime": {
    color: "#828282",
    fontSize: "13px",
  },
});

export const ContentContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "50px",
  "& .leftSection": {
    width: "40%",
  },
});

export const ImageSliderContainer = styled("div", {
  width: "100%",
  aspectRatio: "1/1",
  border: "1px solid #DBDBDB",
  borderRadius: "10px",
  overflow: "hidden",
  marginBottom: "10px",
  position: "relative",
  "& .imageList": {
    display: "flex",
    height: "100%",
    transition: "transform 0.5s",
    "& .imageBox": {
      height: "100%",
      aspectRatio: "1/1",
      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
    },
  },
  "& .indicatorContainer": {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "0",
    height: "9%",
    background:
      "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3))",
    "& .indicator": {
      display: "flex",
      gap: "10px",
      position: "absolute",
      bottom: "40%",
      left: "50%",
      transform: "translateX(-50%)",
      "& .item": {
        width: "5px",
        height: "5px",
        background: "white",
        borderRadius: "10px",
        opacity: "0.3",
        "&.active": {
          opacity: "1",
        },
      },
    },
  },
  "& svg": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "10%",
    height: "10%",
    stroke: "white",
    strokeWidth: "0.8",
    cursor: "pointer",
    transition: "opacity 0.4s",
    "&.inactive": {
      opacity: "0",
    },
    "&.left": {
      left: "0%",
    },
    "&.right": {
      right: "0%",
    },
  },
});

export const ProfileContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  "& .userInfo": {
    "& .nickname": {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "4px",
    },
    "& .timeTogether": {
      fontSize: "12px",
      color: "#828282",
    },
  },
  "& svg": {
    width: "12%",
    fill: MainColor,
  },
});

export const BasicInfoContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flexGrow: "1",
  "& .item": {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    "& svg": {
      width: "23px",
      height: "23px",
      stroke: MainColor,
      strokeWidth: "1",
    },
  },
});