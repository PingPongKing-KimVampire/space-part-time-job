import React from "react";
import { createStitches } from "@stitches/react";
import { BeatLoader } from "react-spinners";
import { MainColor } from "../styles/global";

const { styled } = createStitches();

const Container = styled("div", {
  width: "100%",
  height: "100%",
  position: "fixed",
  background: "rgba(255, 255, 255, 0.5)",
  zIndex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LoadingOverlay = () => {
  return (
    <Container>
      <BeatLoader color={MainColor} />
    </Container>
  );
};

export default LoadingOverlay;
