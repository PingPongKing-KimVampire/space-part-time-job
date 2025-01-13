import React from "react";
import { BeatLoader } from "react-spinners";
import { MainColor } from "../styles/global";
import { Container } from "../styles/components/LoadingOverlay.styles.ts";

const LoadingOverlay = () => {
  return (
    <Container>
      <BeatLoader color={MainColor} />
    </Container>
  );
};

export default LoadingOverlay;
