import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TAB_INFO } from "../../pages/MyPage.tsx";
import { Tab } from "../../types/types.ts";
import MyPostList from "./MyPostList.tsx";
import MyAppliedPostList from "./MyAppliedPostList.tsx";
import MyInterestPostList from "./MyInterestPostList.tsx";

type PostListProp = {
  selectedTab: Tab;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export type MouseEventHandlers = {
  onItemMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onInnerClickableMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onInnerClickableMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
};

const PostList: React.FC<PostListProp> = ({ selectedTab, setIsLoading }) => {
  const navigate = useNavigate();

  const onItemMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.classList.add("isHovering");
    },
    []
  );
  const onItemMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.classList.remove("isHovering");
    },
    []
  );
  const onItemClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const postId = e.currentTarget.getAttribute("data-post-id");
    if (!postId) return;
    navigate(`/view-job/${postId}`);
  };
  const onInnerClickableMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      (e.target as Element).closest(".item")?.classList.remove("isHovering");
    },
    []
  );
  const onInnerClickableMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      (e.target as Element).closest(".item")?.classList.add("isHovering");
    },
    []
  );

  const mouseEventHandlers: MouseEventHandlers = useMemo(() => {
    return {
      onItemMouseEnter,
      onItemMouseLeave,
      onItemClick,
      onInnerClickableMouseEnter,
      onInnerClickableMouseLeave,
    };
  }, [
    onItemMouseEnter,
    onItemMouseLeave,
    onItemClick,
    onInnerClickableMouseEnter,
    onInnerClickableMouseLeave,
  ]);

  if (!selectedTab || !selectedTab.label) return null;
  if (selectedTab.label === TAB_INFO.post.label) {
    return (
      <MyPostList
        mouseEventHandlers={mouseEventHandlers}
        setIsLoading={setIsLoading}
      />
    );
  } else if (selectedTab.label === TAB_INFO.apply.label) {
    return (
      <MyAppliedPostList
        mouseEventHandlers={mouseEventHandlers}
        setIsLoading={setIsLoading}
      />
    );
  }
  return (
    <MyInterestPostList
      mouseEventHandlers={mouseEventHandlers}
      setIsLoading={setIsLoading}
    />
  );
};

export default PostList;
