import React, { useMemo, useCallback } from "react";
import { Tab, TAB_INFO } from "../../pages/MyPage.tsx";
import MyPostList from "./MyPostList.tsx";
import MyAppliedPostList from "./MyAppliedPostList.tsx";
import MyInterestPostList from "./MyInterestPostList.tsx";

type PostListProp = {
  selectedTab: Tab;
};

export type MouseEventHandlers = {
  onItemMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onInnerClickableMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onInnerClickableMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
};

const PostList: React.FC<PostListProp> = ({ selectedTab }) => {
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
      onInnerClickableMouseEnter,
      onInnerClickableMouseLeave,
    };
  }, [
    onItemMouseEnter,
    onItemMouseLeave,
    onInnerClickableMouseEnter,
    onInnerClickableMouseLeave,
  ]);

  if (!selectedTab || !selectedTab.label) return null;
  if (selectedTab.label === TAB_INFO.post.label) {
    return <MyPostList mouseEventHandlers={mouseEventHandlers} />;
  } else if (selectedTab.label === TAB_INFO.apply.label) {
    return <MyAppliedPostList mouseEventHandlers={mouseEventHandlers} />;
  }
  return <MyInterestPostList mouseEventHandlers={mouseEventHandlers} />;
};

export default PostList;
