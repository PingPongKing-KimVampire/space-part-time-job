import React from "react";
import { TabsContainer } from "../../styles/MyPage.styles.ts";
import { TAB_INFO, Tab } from "../../pages/MyPage.tsx";

type TabsProps = {
  selectedTab: Tab;
  setSelectedTab: React.Dispatch<React.SetStateAction<Tab>>;
};

const Tabs: React.FC<TabsProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <TabsContainer>
      {Object.values(TAB_INFO).map((currentTab) => {
        const { label, pos } = currentTab;
        return (
          <button
            className={`tabButton ${selectedTab.pos === pos ? "selected" : ""}`}
            key={label}
            onClick={() => {
              setSelectedTab(currentTab);
            }}
          >
            {label}
          </button>
        );
      })}
      <div className={`tabIndicator ${selectedTab.pos}`} />
    </TabsContainer>
  );
};

export default Tabs;
