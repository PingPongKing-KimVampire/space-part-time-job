import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, FetchResult } from "@apollo/client";
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
};

const ViewJobPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [isApplicationModalVisible, setIsApplicationModalVisible] =
    useState(false);
  const [jobPost, setJobPost] = useState<JobPost>({
    id: "",
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
  });

  const { id = "" } = useParams();

  const {
    loading: getJobPostLoading,
    error: getJobPostError,
    data: jobPostData,
  } = useQuery<{ getJobPost: JobPost }, { id: string }>(GET_JOB_POST, {
    variables: { id },
  });
  useEffect(() => {
    if (!jobPostData) return;
    setJobPost({
      ...jobPostData.getJobPost,
      createdAt: formatTimeAgo(jobPostData.getJobPost.createdAt),
      publisher: {
        ...jobPostData.getJobPost.publisher,
        createdAt: formatTimeAgo(jobPostData.getJobPost.publisher.createdAt),
      },
    });
  }, [jobPostData, setJobPost]);

  const [
    incrementViews,
    { loading: incrementViewsLoading, error: incrementViewsError },
  ] = useMutation<{ data: { incrementJobPostViews: number } }, { id: string }>(
    INCREMENT_JOB_POST_VIEWS
  );
  useEffect(() => {
    if (!jobPostData) return;
    const setupViews = async () => {
      const response: any = await incrementViews({
        variables: { id },
      });
      setJobPost((state) => ({
        ...state,
        views: response.data.incrementJobPostViews,
      }));
    };
    setupViews();
  }, [jobPostData]);

  return (
    <Background>
      {getJobPostLoading && incrementViewsLoading && <LoadingOverlay />}
      <Container>
        <Header
          jobTypes={jobPost.jobDescription}
          title={jobPost.title}
          postTime={jobPost.createdAt}
          viewCount={jobPost.views}
          // viewCount={20}
          interestCount={8} // TODO : 교체하기
        />
        <Content
          jobPost={jobPost}
          displayApplicationModal={() => {
            setIsApplicationModalVisible(true);
          }}
        />
      </Container>
      {isApplicationModalVisible && (
        <ApplicationModal
          onXClick={() => {
            setIsApplicationModalVisible(false);
          }}
        />
      )}
    </Background>
  );
};

export default ViewJobPage;
