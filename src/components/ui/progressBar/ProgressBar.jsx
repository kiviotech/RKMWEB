// src/ProgressBar.js
import React from 'react';
import './ProgressBar.scss';
import icons from '../../../constants/icons';

const ProgressBar = ({ title, completed, total, color, backgroundColor }) => {
    const percentage = (completed / total) * 100;

    return (
        <div className="progress-bar-container">
            <h3>{title}</h3>
            <div className="progress-bar" style={{ backgroundColor: `${backgroundColor}` }}>
                <div className="progress" style={{ width: `${percentage}%`, backgroundColor: `${color}` }}></div>
            </div>
            <p>Checked-in: {completed}/{total}</p>

            <div className="view-all-btn">
                <span>View all <img src={icons.angleRight} alt="angle" loading='lazy' /></span>
            </div>
        </div>
    );
};

export default ProgressBar;