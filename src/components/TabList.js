import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const TabList = ({ tabs, activeTab, setActiveTab, removeTab }) => {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''} overflow-hidden`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.title}</span>
          {tab.id !== 'Home' && (
            <button
              className="close-btn p-0"
              onClick={(e) => {
                e.stopPropagation(); // 부모 탭 클릭 이벤트 차단
                removeTab(tab.id);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabList;
