import React, { useState } from 'react';
import './UtilityTabs.scss';
import ImportUsers from './ImportUsers/ImportUsers';
import ImportLegacyData from './ImportUsers/ImportLegacyData';

const UtilityTabs = () => {
  const [activeTab, setActiveTab] = useState('import-users');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'import-users':
        return <ImportUsers />;
      case 'import-legacy-data':
        return <ImportLegacyData />;
      // Add more tabs as needed
      default:
        return <ImportUsers />;
    }
  };

  return (
    <div className="utility-tabs-container">
      <div className="utility-tabs-header">
        <h2>Utility Tabs</h2>
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'import-users' ? 'active' : ''}`}
            onClick={() => setActiveTab('import-users')}
          >
            Import Users
          </button>
          <button 
            className={`tab-button ${activeTab === 'import-legacy-data' ? 'active' : ''}`}
            onClick={() => setActiveTab('import-legacy-data')}
          >
            Import Legacy Data
          </button>
          {/* Add more tab buttons as needed */}
        </div>
      </div>
      <div className="utility-tabs-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UtilityTabs;
