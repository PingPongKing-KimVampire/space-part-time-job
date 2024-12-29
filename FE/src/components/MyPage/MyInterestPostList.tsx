import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../../utils/formatTimeAgo.ts";
import { MouseEventHandlers } from "./PostList.tsx";
import { JOB_POST_STATUS } from "../../constants/constants.ts";
import { ListItem } from "../../styles/MyPage.styles";
import { CloseTag } from "../../styles/global.ts";
import { LIST_MY_INTERESTED_JOB_POSTS } from "../../api/graphql/queries.js";
import { UNMARK_JOB_POST_AS_INTEREST } from "../../api/graphql/mutations.js";
import { InterestedJobPost } from "../../types/types.ts";

type MyInterestPostListProps = {
  mouseEventHandlers: MouseEventHandlers;
};

const MyInterestedPostList: React.FC<MyInterestPostListProps> = ({
  mouseEventHandlers,
}) => {
  const navigate = useNavigate();
  const {
    onItemMouseEnter,
    onItemMouseLeave,
    onInnerClickableMouseEnter,
    onInnerClickableMouseLeave,
  } = mouseEventHandlers;

  const [myInterestPosts, setMyInterestPosts] = useState<InterestedJobPost[]>(
    []
  );
  const {
    data: interestedPostsData,
    loading: getInterestedPostsLoading,
    error: getInterestedPostsError,
  } = useQuery(LIST_MY_INTERESTED_JOB_POSTS, { fetchPolicy: "network-only" });
  useEffect(() => {
    if (!interestedPostsData || !interestedPostsData.listMyInterestedJobPosts)
      return;
    setMyInterestPosts(
      interestedPostsData.listMyInterestedJobPosts.map((interestedPost) => ({
        ...interestedPost,
        createdAt: formatTimeAgo(interestedPost.createdAt),
      }))
    );
  }, [interestedPostsData]);

  const [
    unmarkInterest,
    { loading: unmarkInterestLoading, error: unmarkInterestError },
  ] = useMutation(UNMARK_JOB_POST_AS_INTEREST);
  const onCancelClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const postId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-post-id");
    if (!postId) return;
    await unmarkInterest({ variables: { jobPostId: postId } });
    setMyInterestPosts((state) =>
      state.filter((interestedPost) => interestedPost.jobPost.id !== postId)
    );
  };

  const onItemClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const postId = e.currentTarget.getAttribute("data-post-id");
    if (!postId) return;
    navigate(`/view-job/${postId}`);
  };

  return (
    <>
      {myInterestPosts.map(({ jobPost, createdAt }) => (
        <ListItem
          className="item"
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
          onClick={onItemClick}
          key={jobPost.id}
          data-post-id={jobPost.id}
        >
          <div className="main">
            {jobPost.status === JOB_POST_STATUS.CLOSE && (
              <CloseTag>마감</CloseTag>
            )}
            <button className="withItemHover">{jobPost.title}</button>
          </div>
          <div className="interaction">
            <div className="interestAgo">{createdAt} 전 관심</div>
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
