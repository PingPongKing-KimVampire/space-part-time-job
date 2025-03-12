import React, { useRef, useEffect } from "react";
import { JobListContainer } from "../../styles/pages/ExploreJobsPage.styles";
import JobItem from "./JobItem.tsx";
import { JobPost } from "../../types/types.ts";

type JobListProps = {
  totalCount: number;
  jobPosts: JobPost[];
  fetchMoreJobPosts: () => Promise<void>;
  loading: boolean;
};

const JobList: React.FC<JobListProps> = (props) => {
  const { totalCount, jobPosts, fetchMoreJobPosts, loading } = props;
  const bottomRef = useRef(null);
  const fetchMoreJobPostsRef = useRef(fetchMoreJobPosts);
  useEffect(() => {
    fetchMoreJobPostsRef.current = fetchMoreJobPosts;
  }, [fetchMoreJobPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchMoreJobPostsRef.current();
      },
      {
        root: null, // 뷰포트 기준으로 관찰
        rootMargin: "0px", // 추가적인 마진 설정 없음
        threshold: 0.5, // 요소가 50% 화면에 보일 때 작동
      }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, []);

  return (
    <>
      <JobListContainer>
        <p className="totalCount">
          총 <span className="count">{totalCount}</span>개의 검색 결과
        </p>
        <div className="jobList">
          {loading && (
            <>
              <div className="loadingItem" />
              <div className="loadingItem" />
              <div className="loadingItem" />
            </>
          )}
          {!loading && totalCount === 0 && (
            <div className="noJobNotice">아직 게시된 공고가 없어요.</div>
          )}
          {!loading &&
            jobPosts.map((job) => {
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
                  id={id}
                  title={title}
                  neighborhood={addressName || ""}
                  createdAt={createdAt || ""}
                  pay={{
                    type: salary?.salaryType || "",
                    amount: salary?.salaryAmount || 0,
                  }}
                  period={workPeriod || { type: "" }}
                  time={{
                    type: workTime?.type || "",
                    startTime: workTime?.startTime || "",
                    endTime: workTime?.endTime || "",
                  }}
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
