import { createStitches } from "@stitches/react";

const { styled } = createStitches();

const Background = styled("div", {
  width: "100vw",
  height: "100vh",
});

function App() {
  return <Background></Background>;
}

export default App;
