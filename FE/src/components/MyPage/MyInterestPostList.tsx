import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { LIST_MY_INTEREST_JOB_POSTS } from "../../graphql/queries.js";
import formatTimeAgo from "../../utils/formatTimeAgo.ts";
import { MouseEventHandlers } from "./PostList.tsx";
import { JOB_POST_STATUS } from "../../constants/constants.ts";
import { ListItem } from "../../styles/MyPage.styles";
import { CloseTag } from "../../styles/global.ts";

type MyInterestPostListProps = {
  mouseEventHandlers: MouseEventHandlers;
};

type JobPost = {
  id: string;
  status: string;
  title: string;
};

type InterestedJobPost = {
  jobPost: JobPost;
  createdAt: string;
};

const MyInterestPostList: React.FC<MyInterestPostListProps> = ({
  mouseEventHandlers,
}) => {
  const navigatge = useNavigate();
  const {
    onItemMouseEnter,
    onItemMouseLeave,
    onInnerClickableMouseEnter,
    onInnerClickableMouseLeave,
  } = mouseEventHandlers;

  const [myInterestPosts, setMyInterestPosts] = useState<InterestedJobPost[]>([
    {
      jobPost: {
        id: "1",
        title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
        status: "OPEN",
      },
      createdAt: "1일 전",
    },
    {
      jobPost: {
        id: "2",
        title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
        status: "OPEN",
      },
      createdAt: "2일 전",
    },
    {
      jobPost: {
        id: "3",
        title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
        status: "CLOSE",
      },
      createdAt: "2일 전",
    },
  ]);
  //   const {
  //     data: interestPostsData,
  //     loading: getInterestPostsLoading,
  //     error: getInterestPostsError,
  //   } = useQuery(LIST_MY_INTEREST_JOB_POSTS);
  //   useEffect(() => {
  //     if (!interestPostsData || !interestPostsData.listMyInterestJobPosts) return;
  //     setMyInterestPosts(
  //       interestPostsData.listMyInterestJobPosts.map((interestedPost) => ({
  //         ...interestedPost,
  //         createdAt: formatTimeAgo(interestedPost.createdAt),
  //       }))
  //     );
  //   }, [interestPostsData]);

  return (
    <>
      {myInterestPosts.map(({ jobPost, createdAt }) => (
        <ListItem
          className="item"
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
          key={jobPost.id}
          data-post-id={jobPost.id}
        >
          <div className="title">
            {jobPost.status === JOB_POST_STATUS.CLOSE && (
              <CloseTag>마감</CloseTag>
            )}
            <a className="withItemHover">{jobPost.title}</a>
          </div>
          <div className="interaction">
            {/* TODO : 교체하기 */}
            <div className="interestAgo">{createdAt}</div>
            <button
              onMouseEnter={onInnerClickableMouseEnter}
              onMouseLeave={onInnerClickableMouseLeave}
            >
              관심 취소
            </button>
          </div>
        </ListItem>
      ))}
    </>
  );
};

export default MyInterestPostList;
