import React from "react";
import { TabsContainer } from "../../styles/MyPage.styles";
import { TAB_INFO, Tab } from "../../pages/MyPage.tsx";

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
