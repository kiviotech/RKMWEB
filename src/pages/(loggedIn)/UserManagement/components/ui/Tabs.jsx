import React, { useState, createContext, useContext } from 'react';
import './shadcn.scss';

// Create a context for the tabs
const TabsContext = createContext(null);

export const Tabs = ({ children, defaultValue, className = '', onValueChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };
  
  // Create a context value that includes both activeTab and the change handler
  const value = {
    activeTab,
    onSelect: handleTabChange
  };
  
  return (
    <TabsContext.Provider value={value}>
      <div className={`shadcn-tabs ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`shadcn-tabs-list ${className}`} role="tablist">
      {children}
    </div>
  );
};

export const TabsTrigger = ({ children, value, className = '' }) => {
  // Use the TabsContext to get activeTab and onSelect
  const context = useContext(TabsContext);
  
  if (!context) {
    console.warn('TabsTrigger must be used within a Tabs component');
    return null;
  }
  
  const { activeTab, onSelect } = context;
  const isActive = activeTab === value;
  
  return (
    <button
      className={`shadcn-tabs-trigger ${isActive ? 'active' : ''} ${className}`}
      onClick={() => onSelect(value)}
      type="button"
      data-state={isActive ? 'active' : 'inactive'}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, className = '' }) => {
  // Use the TabsContext to get activeTab
  const context = useContext(TabsContext);
  
  if (!context) {
    console.warn('TabsContent must be used within a Tabs component');
    return null;
  }
  
  const { activeTab } = context;
  
  // If not the active tab, don't render anything
  if (activeTab !== value) return null;
  
  return (
    <div 
      className={`shadcn-tabs-content ${className}`}
      role="tabpanel"
      data-state="active"
    >
      {children}
    </div>
  );
};
