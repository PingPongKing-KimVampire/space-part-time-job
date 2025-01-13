import React from "react";
import { TabsContainer } from "../../styles/pages/MyPage.styles";
import { TAB_INFO } from "../../pages/MyPage.tsx";
import { Tab } from "../../types/types.ts";

type TabsProps = {
  selectedTab: Tab;
  setSelectedTab: React.Dispatch<React.SetStateAction<Tab>>;
};

const Tabs: React.FC<TabsProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <TabsContainer>
      {Object.entries(TAB_INFO).map(([key, tab]) => {
        const { label, pos } = tab;
        return (
          <button
            className={`tabButton ${
              selectedTab && selectedTab.pos === pos ? "selected" : ""
            }`}
            key={label}
            onClick={() => {
              sessionStorage.setItem("tabKey", key);
              setSelectedTab(TAB_INFO[key]);
            }}
          >
            {label}
          </button>
        );
      })}
      <div className={`tabIndicator ${selectedTab ? selectedTab.pos : ""}`} />
    </TabsContainer>
  );
};

export default Tabs;
