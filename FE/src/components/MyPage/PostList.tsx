import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tab, TAB_INFO } from "../../pages/MyPage.tsx";
import MyPostList from "./MyPostList.tsx";
import MyAppliedPostList from "./MyAppliedPostList.tsx";

type PostListProp = {
  tab: Tab;
};

export type MouseEventHandlers = {
  onItemMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onItemClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onButtonMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onButtonMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
};

const PostList: React.FC<PostListProp> = ({ tab }) => {
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
  const onItemClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log("e", e);
      const id = e.currentTarget.getAttribute("data-id");
      navigate(`/view-job/${id}`);
    },
    [navigate]
  );
  const onButtonMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.classList.add("isHovering");
    (e.target as Element).closest(".item")?.classList.remove("isHovering");
  }, []);
  const onButtonMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.classList.remove("isHovering");
    (e.target as Element).closest(".item")?.classList.add("isHovering");
  }, []);

  const mouseEventHandlers: MouseEventHandlers = useMemo(() => {
    return {
      onItemMouseEnter,
      onItemMouseLeave,
      onItemClick,
      onButtonMouseEnter,
      onButtonMouseLeave,
    };
  }, [
    onItemMouseEnter,
    onItemMouseLeave,
    onItemClick,
    onButtonMouseEnter,
    onButtonMouseLeave,
  ]);

  if (tab.label === TAB_INFO.POST.label) {
    return <MyPostList mouseEventHandlers={mouseEventHandlers} />;
  } else if (tab.label === TAB_INFO.APPLY.label) {
    return <MyAppliedPostList mouseEventHandlers={mouseEventHandlers} />;
  }
  return null;
};

export default PostList;
