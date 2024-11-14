import React, { useRef } from "react";
import { ListItem } from "../../styles/MyPage.styles.ts";

const POSTS = [
  {
    title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
    isClosed: false,
    applicantCount: 0,
  },
  {
    title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
    isClosed: false,
    applicantCount: 1,
  },
  {
    title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
    isClosed: true,
    applicantCount: 5,
  },
];

const PostList = () => {
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

  return (
    <>
      {POSTS.map(({ title, isClosed, applicantCount }) => (
        <ListItem
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
        >
          <div className="title">
            {isClosed && <div className="closeTag">마감</div>}
            {title}
          </div>
          <div className="interaction">
            {!isClosed && ( // 마감되지 않은 공고에만 마감 버튼 표시
              <button
                className="closeButton"
                onMouseEnter={onButtonMouseEnter}
                onMouseLeave={onButtonMouseLeave}
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
              // TODO: disabled를 설정할 수 없으므로, onClick 이벤트 시 지원자 0명인 경우를 유의하기
            >
              지원자 확인<span className="count">({applicantCount}명)</span>
            </button>
          </div>
        </ListItem>
      ))}
    </>
  );
};

export default PostList;
