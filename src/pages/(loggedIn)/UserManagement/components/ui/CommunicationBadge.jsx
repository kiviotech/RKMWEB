import React, { useState } from 'react';
import './CommunicationBadge.scss';

const CommunicationBadge = ({ status, reason }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const isStopped = status === true;
  
  return (
    <div 
      className="communication-badge-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`communication-badge ${isStopped ? 'stopped' : 'active'}`}>
        {isStopped ? 'No Comms' : 'Active'}
      </span>
      
      {isStopped && showTooltip && reason && (
        <div className="tooltip">
          <div className="tooltip-title">Communication Stopped</div>
          <div className="tooltip-content">Reason: {reason || 'Not specified'}</div>
        </div>
      )}
    </div>
  );
};

export default CommunicationBadge; 