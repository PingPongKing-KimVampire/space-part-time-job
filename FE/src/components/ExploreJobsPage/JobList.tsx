import React, { useRef, useEffect } from "react";
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
    salary: {
      salaryType: "HOURLY",
      salaryAmount: 12000,
    },
    photos: [],
    addressName: "석우동",
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
    salary: {
      salaryType: "MONTHLY",
      salaryAmount: 3000000,
    },
    photos: [testImage1],
    addressName: "반월동",
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
    salary: {
      salaryType: "PER_TASK",
      salaryAmount: 10000,
    },
    photos: [testImage2],
    addressName: "반송동",
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
    salary: {
      salaryType: "HOURLY",
      salaryAmount: 12000,
    },
    photos: [],
    addressName: "석우동",
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
    salary: {
      salaryType: "MONTHLY",
      salaryAmount: 3000000,
    },
    photos: [testImage1],
    addressName: "반월동",
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
    salary: {
      salaryType: "PER_TASK",
      salaryAmount: 10000,
    },
    photos: [testImage2],
    addressName: "반송동",
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
    salary: {
      salaryType: "HOURLY",
      salaryAmount: 12000,
    },
    photos: [],
    addressName: "석우동",
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
    salary: {
      salaryType: "MONTHLY",
      salaryAmount: 3000000,
    },
    photos: [testImage1],
    addressName: "반월동",
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
    salary: {
      salaryType: "PER_TASK",
      salaryAmount: 10000,
    },
    photos: [testImage2],
    addressName: "반송동",
    postTime: "9시간 전",
  },
];

type JobListProps = {
  jobPosts: JobPost[];
  fetchMoreJobPosts: () => void;
};

const JobList: React.FC<JobListProps> = (props) => {
  const { jobPosts, fetchMoreJobPosts } = props;
  const bottomRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchMoreJobPosts();
      },
      {
        root: null, // 뷰포트 기준으로 관찰
        rootMargin: "0px", // 추가적인 마진 설정 없음
        threshold: 1.0, // 요소가 100% 화면에 보일 때만 작동
      }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  });

  return (
    <>
      <JobListContainer>
        <div className="jobList">
          {JOB_RESULT.map((job) => {
            // TODO : jobPosts로 대체
            const {
              id,
              title,
              workPeriod,
              workTime,
              salary,
              photos,
              addressName,
            } = job;
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
        </div>
        <div ref={bottomRef} style={{ height: "10px" }} />
      </JobListContainer>
    </>
  );
};

export default JobList;
