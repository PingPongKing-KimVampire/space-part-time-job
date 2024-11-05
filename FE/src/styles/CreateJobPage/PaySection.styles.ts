import { createStitches } from "@stitches/react";

const { styled } = createStitches();

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const Unit = styled("div", {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: "20px",
  fontSize: "18px",
});

export const MinimumMessage = styled("div", {
  fontSize: "14px",
  marginTop: "10px",
  "& span": {
    fontWeight: "bold",
  },
});
