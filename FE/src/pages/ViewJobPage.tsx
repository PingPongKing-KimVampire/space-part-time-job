import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
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

export type JobPostEdge = {
  myJobApplication: {
    id: string;
  };
  node: JobPost;
};

// TODO: ExploreJobsPage의 JobPost 타입과 어느 정도 반복되는 타입임
export type JobPost = {
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
};

const ViewJobPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [isApplicationModalVisible, setIsApplicationModalVisible] =
    useState(false);
  const [jobPostEdge, setJobPostEdge] = useState<JobPostEdge>({
    myJobApplication: { id: "" },
    node: {
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
    },
  });

  const { id = "" } = useParams();

  const {
    loading: getJobPostLoading,
    error: getJobPostError,
    data: jobPostData,
  } = useQuery<{ getJobPost: JobPostEdge }, { id: string }>(GET_JOB_POST, {
    variables: { id },
  });
  useEffect(() => {
    if (!jobPostData) return;
    const data = jobPostData.getJobPost;
    setJobPostEdge({
      ...data,
      node: {
        ...data.node,
        createdAt: formatTimeAgo(data.node.createdAt),
        publisher: {
          ...data.node.publisher,
          createdAt: formatTimeAgo(data.node.publisher.createdAt),
        },
      },
    });
  }, [jobPostData, setJobPostEdge, isApplicationModalVisible]);

  const [
    incrementViews,
    { loading: incrementViewsLoading, error: incrementViewsError },
  ] = useMutation(INCREMENT_JOB_POST_VIEWS);
  useEffect(() => {
    if (!jobPostData) return;
    const setupViews = async () => {
      const response = await incrementViews({
        variables: { id },
      });
      setJobPostEdge((state) => ({
        ...state,
        node: {
          ...state.node,
          views: response.data.incrementJobPostViews,
        },
      }));
    };
    setupViews();
  }, [jobPostData]);

  return (
    <Background>
      {getJobPostLoading && incrementViewsLoading && <LoadingOverlay />}
      <Container>
        <Header jobPost={jobPostEdge.node} />
        <Content
          jobPostEdge={jobPostEdge}
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
