import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { MouseEventHandlers } from "./PostList";
import { ERROR, JOB_POST_STATUS } from "../../constants/constants";
import { ListItem } from "../../styles/pages/MyPage.styles";
import { CloseTag, WarningText } from "../../styles/global";
import { LIST_MY_INTERESTED_JOB_POSTS } from "../../api/graphql/queries.js";
import { processListInterestedPosts } from "../../api/graphql/processData";
import { UNMARK_JOB_POST_AS_INTEREST } from "../../api/graphql/mutations.js";
import { InterestedJobPost } from "../../types/types";

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
  const [getInterestedPostsFinalError, setGetInterestedPostsFinalError] = useState<Error | null>(null);
  const {
    data: interestedPostsData,
    loading: getInterestedPostsLoading,
    error: getInterestedPostsError,
  } = useQuery(LIST_MY_INTERESTED_JOB_POSTS, { fetchPolicy: "network-only" });
  useEffect(() => {
    if (!interestedPostsData || !interestedPostsData.listMyInterestedJobPosts)
      return;
    try {
      const posts = processListInterestedPosts(interestedPostsData);
      // const posts = [...processListInterestedPosts(interestedPostsData)]; // TODO : 복사 안 해도 되나?
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
    } catch (e) {
      setGetInterestedPostsFinalError(e);
    }
  }, [interestedPostsData]);
  useEffect(() => {
    if (getInterestedPostsError) setGetInterestedPostsFinalError(new Error(ERROR.SERVER));
  }, [getInterestedPostsError])

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
      {unmarkInterestError && <WarningText>{ERROR.SERVER}</WarningText>}
      {getInterestedPostsFinalError && 
        <WarningText>{getInterestedPostsFinalError.message}</WarningText>
      }
    </>
  );
};

export default MyInterestedPostList;
