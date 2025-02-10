import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { PageInfo } from "../../types/types";
import { GET_MY_JOB_POSTS } from "../../api/graphql/queries";
import { processGetMyJobPosts } from "../../api/graphql/processData";
import { CLOSE_JOB_POST } from "../../api/graphql/mutations";
import { processClosePost } from "../../api/graphql/processData";
import { ERROR, JOB_POST_STATUS } from "../../constants/constants";
import { ListItem } from "../../styles/pages/MyPage.styles";
import { CloseTag, WarningText } from "../../styles/global";
import { MouseEventHandlers } from "./PostList";
import { JobPost } from "../../types/types";

type MyPostListProp = {
  mouseEventHandlers: MouseEventHandlers;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyPostList: React.FC<MyPostListProp> = ({
  mouseEventHandlers,
  setIsLoading,
}) => {
  const navigate = useNavigate();
  const {
    onItemMouseEnter,
    onItemMouseLeave,
    onItemClick,
    onInnerClickableMouseEnter,
    onInnerClickableMouseLeave,
  } = mouseEventHandlers;

  const [myJobPosts, setMyJobPosts] = useState<JobPost[]>([]);
  const [myJobPostsPageInfo, setMyJobPostsPageInfo] = useState<PageInfo>({
    hasNextPage: false,
    endCursor: null,
  });
  const isFirstFetchRef = useRef<boolean>(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [getMyJobPostsFinalError, setGetJobPostsFinalError] =
    useState<Error | null>(null);
  const [
    getMyJobPosts,
    { loading: getMyJobPostsLoading, error: getMyJobPostsError },
  ] = useLazyQuery(GET_MY_JOB_POSTS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      try {
        const { posts, pageInfo } = processGetMyJobPosts(data);
        // TODO : 둘 다 기존 데이터 날리는 거 아닌가? 스크롤 시 잘 추가되나?
        if (isFirstFetchRef.current) {
          // 탭이 바뀐 후 패치 -> 기존 데이터 날리고 세로 저장
          setMyJobPosts(posts);
          isFirstFetchRef.current = false;
        } else {
          // 스크롤 다운 후 패치 -> 기존 데이터에 추가
          setMyJobPosts(posts);
        }
        setMyJobPostsPageInfo(pageInfo);
      } catch (e) {
        setGetJobPostsFinalError(e);
      }
    },
  });
  useEffect(() => {
    if (getMyJobPostsError) setGetJobPostsFinalError(new Error(ERROR.SERVER));
  }, [getMyJobPostsError]);

  const fetchMyJobPosts = useCallback(
    (cursor) => {
      try {
        getMyJobPosts({
          variables: {
            filters: { onlyMyPosts: true },
            pagination: { afterCursor: cursor, first: 20 },
          },
        });
      } catch (e) {
        console.error("GetMyJobPosts Query Error: ", e.message);
      }
    },
    [getMyJobPosts]
  );

  useEffect(() => {
    // 맨 처음 데이터 불러올 때
    isFirstFetchRef.current = true;
    fetchMyJobPosts(null);
  }, [fetchMyJobPosts]);

  // TODO : ExploreJobsPage/JobList와 중복됨 -> 커스텀 훅으로 만들자.
  useEffect(() => {
    // 스크롤을 통해 추가적인 데이터 불러올 때
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && myJobPostsPageInfo.hasNextPage) {
          fetchMyJobPosts(myJobPostsPageInfo.endCursor);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [fetchMyJobPosts]);

  const [closeJobPost, { loading: closeLoading, error: closeError }] =
    useMutation(CLOSE_JOB_POST);
  const [closeFinalError, setCloseFinalError] = useState<Error | null>(null);
  useEffect(() => {
    if (closeError) setCloseFinalError(new Error(ERROR.SERVER));
  }, [closeError]);

  const onCloseButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const postId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-post-id");
    if (!postId) return;
    try {
      let response;
      try {
        response = await closeJobPost({ variables: { id: postId } });
      } catch {
        throw new Error(ERROR.SERVER);
      }
      processClosePost(response.data);
    } catch (e) {
      setCloseFinalError(e);
      return;
    }
    setMyJobPosts((state) =>
      state.map((post) => {
        if (post.id !== postId) return post;
        return { ...post, status: JOB_POST_STATUS.CLOSE };
      })
    );
  };

  const onApplicationButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const postId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-post-id");
    if (!postId) return;
    navigate(`/view-applications/${postId}`);
  };

  useEffect(() => {
    setIsLoading(getMyJobPostsLoading || closeLoading);
  }, [getMyJobPostsLoading, closeLoading]);

  return (
    <>
      {myJobPosts.map(({ id, status, title, applicationCount }) => (
        <ListItem
          className="item"
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
          onClick={onItemClick}
          key={id}
          data-post-id={id}
        >
          <div className="main">
            {status === JOB_POST_STATUS.CLOSE && <CloseTag>마감</CloseTag>}
            <div className="title">{title}</div>
          </div>
          <div className="interaction">
            {status === JOB_POST_STATUS.OPEN && ( // 마감되지 않은 공고에만 마감 버튼 표시
              <button
                className="closeButton"
                onMouseEnter={onInnerClickableMouseEnter}
                onMouseLeave={onInnerClickableMouseLeave}
                onClick={onCloseButtonClick}
              >
                마감
              </button>
            )}
            <button
              className={`applicationButton ${
                !applicationCount || applicationCount === 0 ? "inactivated" : ""
              }`}
              onMouseEnter={onInnerClickableMouseEnter}
              onMouseLeave={onInnerClickableMouseLeave}
              onClick={onApplicationButtonClick}
              disabled={!applicationCount || applicationCount === 0}
            >
              지원서 확인
              <span className="count">({applicationCount || "?"}건)</span>
            </button>
          </div>
        </ListItem>
      ))}
      {closeFinalError && <WarningText>{closeFinalError.message}</WarningText>}
      {getMyJobPostsFinalError && (
        <WarningText>{getMyJobPostsFinalError.message}</WarningText>
      )}
      <div ref={bottomRef} style={{ height: "10px", background: "red" }} />
    </>
  );
};

export default MyPostList;
