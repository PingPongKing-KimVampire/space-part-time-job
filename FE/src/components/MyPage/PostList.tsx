import React, { useRef, useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ListItem } from "../../styles/MyPage.styles";
import { GET_MY_JOB_POSTS } from "../../graphql/queries.js";
import { CLOSE_JOB_POST } from "../../graphql/mutations.js";
import { PageInfo } from "../../pages/ExploreJobsPage.tsx";
import { JOB_POST_STATUS } from "../../constants/constants.ts";

const myJobPosts = [
  {
    id: "1",
    title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
    status: "OPEN",
    applicantCount: 0,
  },
  {
    id: "2",
    title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
    status: "OPEN",
    applicantCount: 1,
  },
  {
    id: "3",
    title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
    status: "CLOSE",
    applicantCount: 5,
  },
];

const PostList = ({ tab }) => {
  const navigate = useNavigate();

  // const [myJobPosts, setMyJobPosts] = useState([]);
  const [myJobPostsPageInfo, setMyJobPostsPageInfo] = useState<PageInfo>({
    hasNextPage: false,
    endCursor: null,
  });
  const isChangedTabRef = useRef<boolean>(false);
  const bottomRef = useRef(null);

  // const [
  //   getMyJobPosts,
  //   { loading: getMyJobPostsLoading, error: getMyJobPostsError },
  // ] = useLazyQuery(GET_MY_JOB_POSTS, {
  //   onCompleted: (data) => {
  //     const nodes = data.searchJobPosts.edges.map((edge) => edge.node);
  //     if (isChangedTabRef.current) {
  //       // 탭이 바뀐 후 패치 -> 기존 데이터 날리고 세로 저장
  //       setMyJobPosts(nodes);
  //       isChangedTabRef.current = false;
  //     } else {
  //       // 스크롤 다운 후 패치 -> 기존 데이터에 추가
  //       setMyJobPosts(nodes);
  //     }
  //     setMyJobPostsPageInfo(data.searchJobPosts.pageInfo);
  //   },
  // });

  // const fetchMyJobPosts = (cursor) => {
  //   getMyJobPosts({
  //     variables: {
  //       filters: { onlyMyPosts: true },
  //       pagination: { afterCursor: cursor, first: 20 },
  //     },
  //   });
  // };

  // useEffect(() => {
  //   // 탭 바뀐 후 패치
  //   isChangedTabRef.current = true;
  //   fetchMyJobPosts(null);
  // }, [tab]);

  // // TODO : ExploreJobsPage/JobList와 중복됨 -> 커스텀 훅으로 만들자.
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting && myJobPostsPageInfo.hasNextPage) {
  //         fetchMyJobPosts(myJobPostsPageInfo.endCursor);
  //       }
  //     },
  //     { root: null, rootMargin: "0px", threshold: 1.0 }
  //   );
  //   if (bottomRef.current) observer.observe(bottomRef.current);
  //   return () => {
  //     if (bottomRef.current) observer.unobserve(bottomRef.current);
  //   };
  // }, [fetchMyJobPosts]);

  const onItemMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.add("isHovering");
  };
  const onItemMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.remove("isHovering");
  };
  const onButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.add("isHovering");
    e.currentTarget.parentElement!.parentElement!.classList.remove(
      "isHovering"
    );
  };
  const onButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.classList.remove("isHovering");
    e.currentTarget.parentElement!.parentElement!.classList.add("isHovering");
  };

  const [closeJobPost, { loading: closeLoading, error: closeError }] =
    useMutation(CLOSE_JOB_POST);
  const onCloseButtonClick = async (e) => {
    const postId = e.target.closest(".item")?.getAttribute("data-id");
    if (!postId) return;
    await closeJobPost({ variables: { id: postId } });
    // setMyJobPosts((state) =>
    //   state.map((post) => {
    //     if (post.id !== postId) return post;
    //     return { ...post, status: JOB_POST_STATUS.CLOSE };
    //   })
    // );
  };

  const onApplicantButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const postId = e.currentTarget.getAttribute("data-id") || "";
    navigate(`/view-applicants/${postId}`);
  };

  return (
    <>
      {myJobPosts.map(({ id, status, title, applicantCount }) => (
        <ListItem
          className="item"
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
          key={id}
          data-id={id}
        >
          <div className="title">
            {status === JOB_POST_STATUS.CLOSE && (
              <div className="closeTag">마감</div>
            )}
            {title}
          </div>
          <div className="interaction">
            {status === JOB_POST_STATUS.OPEN && ( // 마감되지 않은 공고에만 마감 버튼 표시
              <button
                className="closeButton"
                onMouseEnter={onButtonMouseEnter}
                onMouseLeave={onButtonMouseLeave}
                onClick={onCloseButtonClick}
              >
                마감
              </button>
            )}
            <button
              className={`applicantButton ${
                applicantCount === 0 ? "inactivated" : ""
              }`}
              onMouseEnter={onButtonMouseEnter}
              onMouseLeave={onButtonMouseLeave}
              onClick={onApplicantButtonClick}
              data-id={id}
              disabled={applicantCount === 0}
            >
              지원자 확인<span className="count">({applicantCount}명)</span>
            </button>
          </div>
        </ListItem>
      ))}
      <div ref={bottomRef} style={{ height: "10px", background: "red" }} />
    </>
  );
};

export default PostList;
