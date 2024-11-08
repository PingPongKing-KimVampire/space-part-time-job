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
  width: "1200px",
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
      padding: "5px 10px",
      background: OptionHoverColor,
      borderRadius: "10px",
      fontWeight: "600",
    },
  },
  "& .title": {
    fontSize: "32px",
    fontWeight: "bold",
  },
  "& .postTime": {
    color: "#828282",
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
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
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
    fontSize: "15px",
    "& svg": {
      width: "25px",
      height: "25px",
      stroke: MainColor,
      strokeWidth: "1",
    },
  },
});
