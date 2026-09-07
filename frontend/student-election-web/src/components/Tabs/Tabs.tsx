// src/components/Tabs/Tabs.tsx
import React, { type ReactNode, useState } from "react";
import styles from "./Tabs.module.scss";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, className }) => {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : "")
  );

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className={`${styles.tabsContainer} ${className || ""}`}>
      <div className={styles.tabHeader} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            className={`${styles.tabButton} ${tab.id === activeTab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent} role="tabpanel">
        {currentTab?.content}
      </div>
    </div>
  );
};

export default Tabs;
