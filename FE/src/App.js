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
import ExploreJobsPage from "./pages/ExploreJobsPage.tsx";
import ViewJobPage from "./pages/ViewJobPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import ViewApplicantsPage from "./pages/ViewApplicantsPage.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import NavigationBar from "./components/NavigationBar.tsx";
import AuthRoute from "./routes/AuthRoute.tsx";
import NotFoundRoute from "./routes/NotFoundRoute.tsx";
import { IP_ADDRESS } from "./constants/constants";

const { styled } = createStitches();

const Background = styled("div", {
  minWidth: "calc(100vw - 15px)",
  minHeight: "100vh",
  position: "relative",
  display: "flex",
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
            <Route element={<AuthRoute />}>
              <Route path="/search-neighbor" element={<SearchNeighborPage />} />
              <Route
                path="/set-neighbor-scope"
                element={<SetNeighborScopePage />}
              />
              <Route element={<NavigationBar />}>
                <Route path="/create-job" element={<CreateJobPage />} />
                <Route path="/explore-jobs" element={<ExploreJobsPage />} />
                <Route path="/view-job/:id" element={<ViewJobPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route
                  path="/view-applicants/:id"
                  element={<ViewApplicantsPage />}
                />
              </Route>
              <Route path="*" element={<NotFoundRoute />} />
            </Route>
          </Routes>
        </Background>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
