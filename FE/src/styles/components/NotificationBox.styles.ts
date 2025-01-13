import { createStitches } from "@stitches/react";

const { styled } = createStitches();

export const Box = styled("div", {
  position: "fixed",
  bottom: "30px",
  background: "black",
  color: "white",
  width: "700px",
  padding: "16px",
  borderRadius: "10px",
  boxSizing: "border-box",
  zIndex: "1",
});
