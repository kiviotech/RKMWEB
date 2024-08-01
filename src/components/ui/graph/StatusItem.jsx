import React from 'react';
import './StatusItem.scss';

const StatusItem = ({ color, text, number, paddingLeft }) => {
    return (
        <div className="status-item">
            <span className="status-color" style={{ backgroundColor: color }}></span>
            <span className="status-text">{text}</span>
            <span className="status-number" style={{ 'paddingLeft': `${paddingLeft}px` }}>{number}</span>
        </div>
    )
}

export default StatusItem
