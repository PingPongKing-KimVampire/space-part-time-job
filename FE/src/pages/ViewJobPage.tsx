import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import formatTimeAgo from "../utils/formatTimeAgo";
import Header from "../components/ViewJobPage/Header.tsx";
import Content from "../components/ViewJobPage/Content.tsx";
import ApplicationModal from "../components/ViewJobPage/ApplicationModal.tsx";
import useBackgroundColor from "../utils/useBackgroundColor";
import { Background, Container } from "../styles/ViewJobPage.styles";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import { MainBackgroundColor } from "../styles/global";
import { GET_JOB_POST } from "../graphql/queries";

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
  });

  const { id = "" } = useParams();

  const { loading, error, data } = useQuery<
    { jobPost: JobPost }, // TODO : 틀리면 고치기
    { id: string }
  >(GET_JOB_POST, {
    variables: { id },
  });
  useEffect(() => {
    if (!data) return;
    setJobPost({
      ...data.jobPost, // TODO : 틀리면 고치기
      createdAt: formatTimeAgo(jobPost.createdAt),
    });
  }, [data, setJobPost]);

  return (
    <Background>
      {loading && <LoadingOverlay />}
      <Container>
        <Header
          jobTypes={jobPost.jobDescription}
          title={jobPost.title}
          postTime={jobPost.createdAt}
          viewCount={25}
          interestCount={8}
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
