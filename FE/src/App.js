import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createStitches } from "@stitches/react";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./api/graphql/apolloClient.js";
import SignupPage from "./pages/SignupPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CreateJobPage from "./pages/CreateJobPage.tsx";
import SearchNeighborhoodPage from "./pages/SearchNeighborhoodPage.tsx";
import SetNeighborhoodScopePage from "./pages/SetNeighborhoodScopePage.tsx";
import ExploreJobsPage from "./pages/ExploreJobsPage.tsx";
import ViewJobPage from "./pages/ViewJobPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import ViewApplications from "./pages/ViewApplicationsPage.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import NavigationBar from "./components/NavigationBar.tsx";
import AuthRoute from "./routes/AuthRoute.tsx";
import NotFoundRoute from "./routes/NotFoundRoute.tsx";
import { CreateJobProvider } from "./context/CreateJobContext.tsx";
import { ViewJobProvider } from "./context/ViewJobContext.tsx";

const { styled } = createStitches();

const Background = styled("div", {
  minWidth: "calc(100vw - 15px)",
  height: "100vh",
  position: "relative",
  display: "flex",
});

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Background>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route element={<AuthRoute />}> */}
            <Route
              path="/search-neighborhood"
              element={<SearchNeighborhoodPage />}
            />
            <Route
              path="/set-neighborhood-scope"
              element={<SetNeighborhoodScopePage />}
            />
            <Route element={<NavigationBar />}>
              <Route
                path="/create-job"
                element={
                  <CreateJobProvider>
                    <CreateJobPage />
                  </CreateJobProvider>
                }
              />
              <Route path="/explore-jobs" element={<ExploreJobsPage />} />
              <Route
                path="/view-job/:id"
                element={
                  <ViewJobProvider>
                    <ViewJobPage />
                  </ViewJobProvider>
                }
              />
              <Route path="/mypage" element={<MyPage />} />
              <Route
                path="/view-applications/:id"
                element={<ViewApplications />}
              />
            </Route>
            <Route path="*" element={<NotFoundRoute />} />
            {/* </Route> */}
          </Routes>
        </Background>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
