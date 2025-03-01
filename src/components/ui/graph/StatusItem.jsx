import React from 'react';
import './StatusItem.scss';

const StatusItem = ({ color, text, number, paddingLeft, onClick }) => {
    return (
        <div className="status-item" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <span className="status-color" style={{ backgroundColor: color }}></span>
            <span className="status-text">{text}</span>
            <span className="status-number" style={{ 'paddingLeft': `${paddingLeft}px` }}>{number}</span>
        </div>
    )
}

export default StatusItem
