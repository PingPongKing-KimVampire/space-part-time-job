import { createStitches } from "@stitches/react";
import CustomInput from "./components/CustomInput.tsx";

const { styled } = createStitches();

const Background = styled("div", {
  width: "100vw",
  height: "100vh",
});

function App() {
  return (
    <Background>
      <CustomInput
        placeholder="플레이스홀더입니다."
        borderType="multi-top"
        invalid={false}
      />
      <CustomInput
        placeholder="플레이스홀더입니다."
        borderType="multi-middle"
        invalid={false}
      />
      <CustomInput
        placeholder="플레이스홀더입니다."
        borderType="multi-bottom"
        invalid={false}
      />
      <CustomInput
        placeholder="플레이스홀더입니다."
        borderType="single"
        invalid={false}
      />
    </Background>
  );
}

export default App;
