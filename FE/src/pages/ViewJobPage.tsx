import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../utils/formatTimeAgo";
import Header from "../components/ViewJobPage/Header";
import Content from "../components/ViewJobPage/Content";
import ApplicationModal from "../components/ViewJobPage/ApplicationModal";
import useBackgroundColor from "../utils/useBackgroundColor";
import { Background, Container } from "../styles/pages/ViewJobPage.styles";
import LoadingOverlay from "../components/LoadingOverlay";
import { MainBackgroundColor, WarningText } from "../styles/global";
import { GET_JOB_POST } from "../api/graphql/queries";
import { processGetJobPost } from "../api/graphql/processData";
import { INCREMENT_JOB_POST_VIEWS } from "../api/graphql/mutations.js";
import { processIncrementViews } from "../api/graphql/processData";
import useViewJobContext from "../context/ViewJobContext";
import { ERROR } from "../constants/constants";

const ViewJobPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const { id = "" } = useParams();
  const { setJobPost, isApplicationModalVisible } = useViewJobContext();

  const [
    incrementViews,
    { loading: incrementViewsLoading, error: incrementViewsError },
  ] = useMutation(INCREMENT_JOB_POST_VIEWS);

  const [getJobPostFinalError, setGetJobPostFinalError] =
    useState<Error | null>(null);
  const [getJobPost, { loading: getJobPostLoading, error: getJobPostError }] =
    useLazyQuery(GET_JOB_POST, {
      variables: { id },
      fetchPolicy: "network-only",
      onCompleted: async (data) => {
        try {
          const post = processGetJobPost(data);
          let incrementViewsResponse;
          try {
            incrementViewsResponse = await incrementViews({
              variables: { id },
            });
          } catch {
            throw new Error(ERROR.SERVER);
          }
          const views = processIncrementViews(incrementViewsResponse.data);
          setJobPost({
            ...post,
            createdAt: formatTimeAgo(post.createdAt),
            publisher: {
              ...post.publisher,
              createdAt: formatTimeAgo(post.publisher.createdAt),
            },
            views,
          });
        } catch (e) {
          setGetJobPostFinalError(e);
        }
      },
    });
  useEffect(() => {
    if (getJobPostError) setGetJobPostFinalError(new Error(ERROR.SERVER));
  }, [getJobPostError]);

  useEffect(() => {
    if (isApplicationModalVisible) return;
    try {
      getJobPost();
    } catch (e) {
      console.error("GetJobPost Query Error: ", e.message);
    }
  }, [isApplicationModalVisible, getJobPost]);

  if (incrementViewsError)
    return (
      <Background>
        <WarningText>{ERROR.SERVER}</WarningText>
      </Background>
    );
  if (getJobPostFinalError)
    return (
      <Background>
        <WarningText>{getJobPostFinalError.message}</WarningText>
      </Background>
    );
  if (getJobPostLoading) return <LoadingOverlay />;
  return (
    <Background>
      {incrementViewsLoading && <LoadingOverlay />}
      <Container>
        <Header />
        <Content />
      </Container>
      {isApplicationModalVisible && <ApplicationModal />}
    </Background>
  );
};

export default ViewJobPage;
