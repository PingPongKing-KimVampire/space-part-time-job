import { createStitches } from "@stitches/react";
import { OptionHoverColor } from "../../styles/global";

const { styled } = createStitches();

export const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: "10px",
  width: "100%",
  height: "120px",
  marginTop: "-14px",
});

export const UploadButton = styled("button", {
  height: "90%",
  aspectRatio: "1/1",
  borderRadius: "5px",
  background: "#EDEDED",
  border: "1px solid #B2B2B2",
  color: "#7C7C7C",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "2.5px",
  fontSize: "16px",
  fontWeight: "bold",
  transition: " background 0.2s",
  "& svg": {
    width: "40%",
  },
  "&:hover": {
    background: OptionHoverColor,
    borderColor: OptionHoverColor,
    color: "black",
  },
});

export const ImagesContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: "10px",
  overflowX: "auto",
  overflowY: "hidden",
  height: "100%",
  width: "100%",
});

export const ImageDisplay = styled("div", {
  height: "90%",
  aspectRatio: "1/1",
  boxSizing: "border-box",
  position: "relative",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "5px",
  },
  "& button": {
    height: "24%",
    aspectRatio: "1/1",
    border: "none",
    position: "absolute",
    bottom: "100%",
    left: "100%",
    transform: "translateY(+65%) translateX(-65%)",
    borderRadius: "100px",
    background: "#EDEDED",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "& svg": {
      color: "#7C7C7C",
      strokeWidth: "3",
      height: "70%",
    },
  },
});
