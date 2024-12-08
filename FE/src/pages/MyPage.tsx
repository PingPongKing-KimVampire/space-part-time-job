import React, { useState } from "react";
import useBackgroundColor from "../utils/useBackgroundColor";
import Profile from "../components/MyPage/Profile.tsx";
import Tabs from "../components/MyPage/Tabs.tsx";
import PostList from "../components/MyPage/PostList.tsx";
import { MainBackgroundColor } from "../styles/global";
import { Background, TopArea, BottomArea } from "../styles/MyPage.styles";

export type Tab = {
  label: "지원 내역" | "게시한 공고" | "관심 목록";
  pos: "left" | "middle" | "right";
};

export const TAB_INFO: Record<string, Tab> = {
  APPLY: { label: "지원 내역", pos: "left" },
  POST: { label: "게시한 공고", pos: "middle" },
  INTEREST: { label: "관심 목록", pos: "right" },
};

const MyPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const [selectedTab, setSelectedTab] = useState<Tab>(TAB_INFO.APPLY);

  return (
    <Background>
      <TopArea>
        <div className="container">
          <Profile />
          <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
      </TopArea>
      <BottomArea>
        <PostList />
      </BottomArea>
    </Background>
  );
};

export default MyPage;
