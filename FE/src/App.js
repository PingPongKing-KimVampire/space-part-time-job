import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createStitches } from "@stitches/react";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CreateJobPage from "./pages/CreateJobPage.tsx";

const { styled } = createStitches();

const Background = styled("div", {
  width: "100vw",
  height: "100vh",
});

function App() {
  return (
    <BrowserRouter>
      <Background>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/createJob" element={<CreateJobPage />} />
        </Routes>
      </Background>
    </BrowserRouter>
  );
}

export default App;
