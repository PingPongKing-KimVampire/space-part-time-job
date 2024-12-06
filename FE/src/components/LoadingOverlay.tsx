import React from "react";
import { createStitches } from "@stitches/react";
import { GridLoader } from "react-spinners";
import { MainColor } from "../styles/global.ts";

const { styled } = createStitches();

const Container = styled("div", {
  width: "100%",
  height: "100%",
  position: "fixed",
  background: "rgba(255, 255, 255, 0.6)",
  zIndex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LoadingOverlay = () => {
  return (
    <Container>
      <GridLoader color={MainColor} />
    </Container>
  );
};

export default LoadingOverlay;
