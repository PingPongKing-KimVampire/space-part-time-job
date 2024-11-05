import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createStitches } from "@stitches/react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CreateJobPage from "./pages/CreateJobPage.tsx";
import SearchLocationPage from "./pages/SearchLocationPage.tsx";
import SetLocationScopePage from "./pages/SetLocationScopePage.tsx";
import { IP_ADDRESS } from "./constants/constants.ts";

const { styled } = createStitches();

const Background = styled("div", {
  width: "100vw",
  height: "100vh",
});

const client = new ApolloClient({
  uri: `http://${IP_ADDRESS}`,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Background>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-job" element={<CreateJobPage />} />
            <Route path="/search-location" element={<SearchLocationPage />} />
            <Route
              path="/set-location-scope"
              element={<SetLocationScopePage />}
            />
          </Routes>
        </Background>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
