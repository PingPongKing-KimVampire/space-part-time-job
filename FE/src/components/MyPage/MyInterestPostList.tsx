import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../../utils/formatTimeAgo.ts";
import { MouseEventHandlers } from "./PostList.tsx";
import { ERROR, JOB_POST_STATUS } from "../../constants/constants.ts";
import { ListItem } from "../../styles/pages/MyPage.styles";
import { CloseTag, WarningText } from "../../styles/global.ts";
import { LIST_MY_INTERESTED_JOB_POSTS } from "../../api/graphql/queries.js";
import { UNMARK_JOB_POST_AS_INTEREST } from "../../api/graphql/mutations.js";
import { InterestedJobPost } from "../../types/types.ts";

type MyInterestPostListProps = {
  mouseEventHandlers: MouseEventHandlers;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyInterestedPostList: React.FC<MyInterestPostListProps> = ({
  mouseEventHandlers,
  setIsLoading,
}) => {
  const {
    onItemMouseEnter,
    onItemMouseLeave,
    onItemClick,
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
    const posts = [...interestedPostsData.listMyInterestedJobPosts];
    const sortedPosts = posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setMyInterestPosts(
      sortedPosts.map((post) => ({
        ...post,
        createdAt: formatTimeAgo(post.createdAt),
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
    try {
      await unmarkInterest({ variables: { jobPostId: postId } });
    } catch (e) {
      console.error("UnmarkJobPostAsInterest Mutation Error: ", e.message);
      return;
    }
    setMyInterestPosts((state) =>
      state.filter((interestedPost) => interestedPost.jobPost.id !== postId)
    );
  };

  useEffect(() => {
    setIsLoading(getInterestedPostsLoading || unmarkInterestLoading);
  }, [getInterestedPostsLoading, unmarkInterestLoading]);

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
            <div className="title">{jobPost.title}</div>
          </div>
          <div className="interaction">
            <div className="createdAt">{createdAt} 전 관심</div>
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
      {(getInterestedPostsError || unmarkInterestError) && (
        <WarningText>{ERROR.SERVER}</WarningText>
      )}
    </>
  );
};

export default MyInterestedPostList;
