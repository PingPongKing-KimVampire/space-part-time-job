import { createStitches } from "@stitches/react";
import SignupPage from "./pages/SignupPage.tsx";

const { styled } = createStitches();

const Background = styled("div", {
  width: "100vw",
  height: "100vh",
});

function App() {
  return (
    <Background>
      <SignupPage />
    </Background>
  );
}

export default App;
