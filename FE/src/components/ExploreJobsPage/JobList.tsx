import React from "react";
import { JobListContainer } from "../../styles/ExploreJobsPage.styles";
import JobItem from "./JobItem.tsx";
import testImage1 from "../../assets/test/ExploreJobsTest1.jpeg";
import testImage2 from "../../assets/test/ExploreJobsTest2.jpeg";
import { JobPost } from "../../pages/ExploreJobsPage";

const JOB_RESULT = [
  // 임시 하드코딩 데이터
  {
    id: 1,
    title: "아이(5세) 하원 도우미, 돌봄 선생님 구합니다.",
    workPeriod: {
      type: "LONG_TERM",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    },
    workTime: {
      type: "FIXED",
      startTime: "15:30",
      endTime: "18:00",
    },
    pay: {
      type: "HOURLY",
      amount: 12000,
    },
    photos: [],
    neighbor: "석우동",
    postTime: "30분 전",
  },
  {
    id: 2,
    title: "해탄 신영통점 홀서빙 직원 모집 (주 3~5일 가능)",
    workPeriod: {
      type: "LONG_TERM",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "SATURDAY"],
    },
    workTime: {
      type: "FIXED",
      startTime: "10:00",
      endTime: "23:00",
    },
    pay: {
      type: "MONTHLY",
      amount: 3000000,
    },
    photos: [testImage1],
    neighbor: "반월동",
    postTime: "2시간 전",
  },
  {
    id: 3,
    title: "커트헤어모델 구해요~!",
    workPeriod: {
      type: "SHORT_TERM",
      dates: [
        "2024-11-13",
        "2024-11-14",
        "2024-11-15",
        "2024-11-16",
        "2024-11-17",
        "2024-11-30",
      ],
    },
    workTime: {
      type: "FLEXIBLE",
      startTime: "10:00",
      endTime: "23:00",
    },
    pay: {
      type: "PER_TASK",
      amount: 10000,
    },
    photos: [testImage2],
    neighbor: "반송동",
    postTime: "9시간 전",
  },
  {
    id: 4,
    title: "아이(5세) 하원 도우미, 돌봄 선생님 구합니다.",
    workPeriod: {
      type: "LONG_TERM",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    },
    workTime: {
      type: "FIXED",
      startTime: "15:30",
      endTime: "18:00",
    },
    pay: {
      type: "HOURLY",
      amount: 12000,
    },
    photos: [],
    neighbor: "석우동",
    postTime: "30분 전",
  },
  {
    id: 5,
    title: "해탄 신영통점 홀서빙 직원 모집 (주 3~5일 가능)",
    workPeriod: {
      type: "LONG_TERM",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "SATURDAY"],
    },
    workTime: {
      type: "FIXED",
      startTime: "10:00",
      endTime: "23:00",
    },
    pay: {
      type: "MONTHLY",
      amount: 3000000,
    },
    photos: [testImage1],
    neighbor: "반월동",
    postTime: "2시간 전",
  },
  {
    id: 6,
    title: "커트헤어모델 구해요~!",
    workPeriod: {
      type: "SHORT_TERM",
      dates: [
        "2024-11-13",
        "2024-11-14",
        "2024-11-15",
        "2024-11-16",
        "2024-11-17",
        "2024-11-30",
      ],
    },
    workTime: {
      type: "FLEXIBLE",
      startTime: "10:00",
      endTime: "23:00",
    },
    pay: {
      type: "PER_TASK",
      amount: 10000,
    },
    photos: [testImage2],
    neighbor: "반송동",
    postTime: "9시간 전",
  },
  {
    id: 7,
    title: "아이(5세) 하원 도우미, 돌봄 선생님 구합니다.",
    workPeriod: {
      type: "LONG_TERM",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    },
    workTime: {
      type: "FIXED",
      startTime: "15:30",
      endTime: "18:00",
    },
    pay: {
      type: "HOURLY",
      amount: 12000,
    },
    photos: [],
    neighbor: "석우동",
    postTime: "30분 전",
  },
  {
    id: 8,
    title: "해탄 신영통점 홀서빙 직원 모집 (주 3~5일 가능)",
    workPeriod: {
      type: "LONG_TERM",
      days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "SATURDAY"],
    },
    workTime: {
      type: "FIXED",
      startTime: "10:00",
      endTime: "23:00",
    },
    pay: {
      type: "MONTHLY",
      amount: 3000000,
    },
    photos: [testImage1],
    neighbor: "반월동",
    postTime: "2시간 전",
  },
  {
    id: 9,
    title: "커트헤어모델 구해요~!",
    workPeriod: {
      type: "SHORT_TERM",
      dates: [
        "2024-11-13",
        "2024-11-14",
        "2024-11-15",
        "2024-11-16",
        "2024-11-17",
        "2024-11-30",
      ],
    },
    workTime: {
      type: "FLEXIBLE",
      startTime: "10:00",
      endTime: "23:00",
    },
    pay: {
      type: "PER_TASK",
      amount: 10000,
    },
    photos: [testImage2],
    neighbor: "반송동",
    postTime: "9시간 전",
  },
];

type JobListProps = {
  jobPosts: JobPost[];
};

const JobList: React.FC<JobListProps> = ({ jobPosts }) => {
  return (
    <JobListContainer>
      {jobPosts.map((job) => {
        const { id, title, workPeriod, workTime, salary, photos, addressName } =
          job;
        const postTime = "2시간 전"; // TODO : 임시
        return (
          <JobItem
            title={title}
            neighbor={addressName}
            postTime={postTime}
            pay={{ type: salary.salaryType, amount: salary.salaryAmount }}
            period={workPeriod}
            time={workTime}
            photos={photos}
            key={id}
          />
        );
      })}
    </JobListContainer>
  );
};

export default JobList;
