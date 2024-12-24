import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const [myInterestPosts, setMyInterestPosts] = useState<JobPost[]>([
    {
      id: "1",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    {
      id: "2",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    {
      id: "3",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "CLOSE",
    },
  ]);

  return (
    <>
      {myInterestPosts.map(({ id, status, title }) => (
        <ListItem
          className="item"
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
          key={id}
          data-post-id={id}
        >
          <div className="title">
            {status === JOB_POST_STATUS.CLOSE && <CloseTag>마감</CloseTag>}
            <a className="withItemHover">{title}</a>
          </div>
          <div className="interaction">
            {/* TODO : 교체하기 */}
            <div className="interestAgo">1일 전 관심</div>
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
