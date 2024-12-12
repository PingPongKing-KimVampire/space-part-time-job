import React, { useRef, useEffect } from "react";
import { JobListContainer } from "../../styles/ExploreJobsPage.styles";
import JobItem from "./JobItem.tsx";
import { JobPost } from "../../pages/ExploreJobsPage";

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
          {jobPosts.map((job) => {
            const photos = job.photos || [];
            const {
              id,
              title,
              workPeriod,
              workTime,
              salary,
              addressName,
              createdAt,
            } = job;
            return (
              <JobItem
                title={title}
                neighbor={addressName}
                createdAt={createdAt}
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
