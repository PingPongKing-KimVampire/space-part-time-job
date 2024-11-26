import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createStitches } from "@stitches/react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CreateJobPage from "./pages/CreateJobPage.tsx";
import SearchNeighborPage from "./pages/SearchNeighborPage.tsx";
import SetNeighborScopePage from "./pages/SetNeighborScopePage.tsx";
import SearchAddressPage from "./pages/SearchAddressPage.tsx";
import ExploreJobsPage from "./pages/ExploreJobsPage.tsx";
import ViewJobPage from "./pages/ViewJobPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import ViewApplicantsPage from "./pages/ViewApplicantsPage.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { IP_ADDRESS } from "./constants/constants.ts";

const { styled } = createStitches();

const Background = styled("div", {
  width: "100vw",
  height: "100vh",
});

const httpLink = new HttpLink({
  uri: `https://${IP_ADDRESS}/api/graphql`, // 서버의 GraphQL 엔드포인트
  credentials: "include", // 쿠키를 포함하여 요청을 보냄
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ScrollToTop />
        <Background>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-job" element={<CreateJobPage />} />
            <Route path="/search-address" element={<SearchAddressPage />} />
            <Route path="/search-neighbor" element={<SearchNeighborPage />} />
            <Route
              path="/set-neighbor-scope"
              element={<SetNeighborScopePage />}
            />
            <Route path="/explore-jobs" element={<ExploreJobsPage />} />
            <Route path="/view-job/:id" element={<ViewJobPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route
              path="/view-applicants/:id"
              element={<ViewApplicantsPage />}
            />
          </Routes>
        </Background>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
