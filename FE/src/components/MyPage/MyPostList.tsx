import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { PageInfo } from "../../types/types.ts";
import { GET_MY_JOB_POSTS } from "../../api/graphql/queries.js";
import { CLOSE_JOB_POST } from "../../api/graphql/mutations.js";
import { ERROR, JOB_POST_STATUS } from "../../constants/constants.ts";
import { ListItem } from "../../styles/pages/MyPage.styles";
import { CloseTag, WarningText } from "../../styles/global.ts";
import { MouseEventHandlers } from "./PostList.tsx";
import { JobPost } from "../../types/types.ts";

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

  const [
    getMyJobPosts,
    { loading: getMyJobPostsLoading, error: getMyJobPostsError },
  ] = useLazyQuery(GET_MY_JOB_POSTS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const nodes = data.searchJobPosts.edges.map((edge) => edge.node);
      if (isFirstFetchRef.current) {
        // 탭이 바뀐 후 패치 -> 기존 데이터 날리고 세로 저장
        setMyJobPosts(nodes);
        isFirstFetchRef.current = false;
      } else {
        // 스크롤 다운 후 패치 -> 기존 데이터에 추가
        setMyJobPosts(nodes);
      }
      setMyJobPostsPageInfo(data.searchJobPosts.pageInfo);
    },
  });

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
  const onCloseButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const postId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-post-id");
    if (!postId) return;
    try {
      await closeJobPost({ variables: { id: postId } });
    } catch (e) {
      console.error("CloseJobPost Mutation Error: ", e.message);
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
                applicationCount === 0 ? "inactivated" : ""
              }`}
              onMouseEnter={onInnerClickableMouseEnter}
              onMouseLeave={onInnerClickableMouseLeave}
              onClick={onApplicationButtonClick}
              disabled={applicationCount === 0}
            >
              지원서 확인<span className="count">({applicationCount}건)</span>
            </button>
          </div>
        </ListItem>
      ))}
      {(getMyJobPostsError || closeError) && (
        <WarningText>{ERROR.SERVER}</WarningText>
      )}
      <div ref={bottomRef} style={{ height: "10px", background: "red" }} />
    </>
  );
};

export default MyPostList;
