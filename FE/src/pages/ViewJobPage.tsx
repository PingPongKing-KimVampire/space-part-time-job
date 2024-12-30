import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../utils/formatTimeAgo";
import Header from "../components/ViewJobPage/Header.tsx";
import Content from "../components/ViewJobPage/Content.tsx";
import ApplicationModal from "../components/ViewJobPage/ApplicationModal.tsx";
import useBackgroundColor from "../utils/useBackgroundColor";
import { Background, Container } from "../styles/ViewJobPage.styles";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import { MainBackgroundColor } from "../styles/global";
import { GET_JOB_POST } from "../api/graphql/queries";
import { INCREMENT_JOB_POST_VIEWS } from "../api/graphql/mutations.js";
import useViewJobContext from "../context/ViewJobContext.tsx";

const ViewJobPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const { id = "" } = useParams();
  const { setJobPost, isApplicationModalVisible } = useViewJobContext();

  const [
    incrementViews,
    { loading: incrementViewsLoading, error: incrementViewsError },
  ] = useMutation(INCREMENT_JOB_POST_VIEWS);

  const [getJobPost, { loading: getJobPostLoading, error: getJobPostError }] =
    useLazyQuery(GET_JOB_POST, {
      variables: { id },
      fetchPolicy: "network-only",
      onCompleted: async (data) => {
        const incrementViewsResponse = await incrementViews({
          variables: { id },
        });
        setJobPost({
          ...data.getJobPost,
          createdAt: formatTimeAgo(data.getJobPost.createdAt),
          publisher: {
            ...data.getJobPost.publisher,
            createdAt: formatTimeAgo(data.getJobPost.publisher.createdAt),
          },
          views: incrementViewsResponse.data.incrementJobPostViews,
        });
      },
    });

  useEffect(() => {
    if (isApplicationModalVisible) return;
    getJobPost();
  }, [isApplicationModalVisible, getJobPost]);

  return (
    <Background>
      {getJobPostLoading && incrementViewsLoading && <LoadingOverlay />}
      <Container>
        <Header />
        <Content />
      </Container>
      {isApplicationModalVisible && <ApplicationModal />}
    </Background>
  );
};

export default ViewJobPage;
