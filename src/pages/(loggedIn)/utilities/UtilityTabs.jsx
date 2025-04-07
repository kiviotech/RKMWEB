
import React, { useState } from 'react';
import ImportUsers from './ImportUsers/ImportUsers';
import './UtilityTabs.scss';

const UtilityTabs = () => {
  const [activeTab, setActiveTab] = useState('import');

  return (
    <div className="utilities-container">
      <div className="utilities-header">
        <h2>Utilities</h2>
        <div className="utilities-tabs">
          <button
            className={`utility-tab-btn ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            Import Users
          </button>
          {/* Add more utility tabs here as needed */}
        </div>
      </div>
      
      <div className="utilities-content">
        {activeTab === 'import' && <ImportUsers />}
        {/* Add more tab content here as needed */}
      </div>
    </div>
  );
};

export default UtilityTabs;
