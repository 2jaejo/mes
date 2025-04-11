import React from 'react';

const TabContent = ({ tabs, activeTab, tabContents }) => {
  return (
    <div className="tab-content">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-pane ${activeTab === tab.id ? 'visible' : 'hidden'}`}
        >
          {tabContents[tab.id]}
        </div>
      ))}
    </div>
  );
};

export default TabContent;
