import React, { useState, useEffect } from "react";
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
import { GET_JOB_POST } from "../graphql/queries";
import { INCREMENT_JOB_POST_VIEWS } from "../graphql/mutations.js";

// TODO: ExploreJobsPage의 JobPost 타입과 어느 정도 반복되는 타입임
export type JobPost = {
  id: string;
  status: string;
  title: string;
  jobDescription: string[];
  workPeriod: { type: string; dates: string[]; days: string[] };
  workTime: { type: string; startTime: string; endTime: string };
  salary: { salaryType: string; salaryAmount: number };
  photos: string[];
  detailedDescription: string;
  addressName: string;
  createdAt: string;
  views: number;
  publisher: { nickname: string; createdAt: string };
  applicationCount: number;
  myJobApplication: { id: string; status: string }[];
  myInterested: { id: string } | null;
  interestedCount: number;
};

const ViewJobPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [isApplicationModalVisible, setIsApplicationModalVisible] =
    useState(false);
  const [jobPost, setJobPost] = useState<JobPost>({
    id: "",
    status: "",
    title: "",
    jobDescription: [],
    workPeriod: { type: "", dates: [], days: [] },
    workTime: { type: "", startTime: "", endTime: "" },
    salary: { salaryType: "", salaryAmount: 0 },
    photos: [],
    detailedDescription: "",
    addressName: "",
    createdAt: "",
    views: 0,
    publisher: { nickname: "", createdAt: "" },
    applicationCount: 0,
    myJobApplication: [],
    myInterested: null,
    interestedCount: 0,
  });

  const { id = "" } = useParams();

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
        <Header jobPost={jobPost} />
        <Content
          jobPost={jobPost}
          setJobPost={setJobPost}
          displayApplicationModal={() => {
            setIsApplicationModalVisible(true);
          }}
        />
      </Container>
      {isApplicationModalVisible && (
        <ApplicationModal
          jobPostId={id}
          onXClick={() => {
            setIsApplicationModalVisible(false);
          }}
        />
      )}
    </Background>
  );
};

export default ViewJobPage;
