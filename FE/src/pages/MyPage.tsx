import React, { useState, useEffect } from "react";
import useBackgroundColor from "../utils/useBackgroundColor";
import Profile from "../components/MyPage/Profile.tsx";
import Tabs from "../components/MyPage/Tabs.tsx";
import PostList from "../components/MyPage/PostList.tsx";
import { MainBackgroundColor } from "../styles/global";
import { Background, TopArea, BottomArea } from "../styles/MyPage.styles";
import { Tab } from "../types/types.ts";
import LoadingOverlay from "../components/LoadingOverlay.tsx";

export const TAB_INFO: Record<string, Tab> = {
  apply: { label: "지원 내역", pos: "left" },
  post: { label: "게시한 공고", pos: "middle" },
  interest: { label: "관심 목록", pos: "right" },
};

const MyPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const [selectedTab, setSelectedTab] = useState(TAB_INFO.apply);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const tabKey = sessionStorage.getItem("tabKey");
    if (tabKey) setSelectedTab(TAB_INFO[tabKey]);
  }, []);

  return (
    <Background>
      {isLoading && <LoadingOverlay />}
      <TopArea>
        <div className="container">
          <Profile />
          <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
      </TopArea>
      <BottomArea>
        <PostList selectedTab={selectedTab} setIsLoading={setIsLoading} />
      </BottomArea>
    </Background>
  );
};

export default MyPage;
