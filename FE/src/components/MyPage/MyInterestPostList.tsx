import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../../utils/formatTimeAgo.ts";
import { MouseEventHandlers } from "./PostList.tsx";
import { JOB_POST_STATUS } from "../../constants/constants.ts";
import { ListItem } from "../../styles/MyPage.styles";
import { CloseTag } from "../../styles/global.ts";
import { LIST_MY_INTERESTED_JOB_POSTS } from "../../graphql/queries.js";
import { UNMARK_JOB_POST_AS_INTEREST } from "../../graphql/mutations.js";

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

const MyInterestedPostList: React.FC<MyInterestPostListProps> = ({
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
  // const {
  //   data: interestedPostsData,
  //   loading: getInterestedPostsLoading,
  //   error: getInterestedPostsError,
  // } = useQuery(LIST_MY_INTERESTED_JOB_POSTS);
  // useEffect(() => {
  //   if (!interestedPostsData || !interestedPostsData.listMyInterestJobPosts)
  //     return;
  //   setMyInterestPosts(
  //     interestedPostsData.listMyInterestJobPosts.map((interestedPost) => ({
  //       ...interestedPost,
  //       createdAt: formatTimeAgo(interestedPost.createdAt),
  //     }))
  //   );
  // }, [interestedPostsData]);

  const [
    unmarkInterest,
    { loading: unmarkInterestLoading, error: unmarkInterestError },
  ] = useMutation(UNMARK_JOB_POST_AS_INTEREST);
  const onCancelClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const postId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-post-id");
    if (!postId) return;
    await unmarkInterest({ variables: { jobPostId: postId } });
    setMyInterestPosts((state) =>
      state.filter((interestedPost) => interestedPost.jobPost.id !== postId)
    );
  };

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
              onClick={onCancelClick}
            >
              관심 취소
            </button>
          </div>
        </ListItem>
      ))}
    </>
  );
};

export default MyInterestedPostList;
