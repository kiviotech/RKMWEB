import React from 'react';

const CommonButton = ({ buttonName, style, buttonWidth, onClick }) => {
    const defaultStyle = {
        width: buttonWidth || 'auto',
        padding: '13px 24px',
        borderRadius: '16px',
        border: 'none',
        backgroundColor: '#9866E9',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '500',
        fontFamily: 'Lexend',
        ...style,
    };

    return (
        <button style={defaultStyle} onClick={onClick}>
            {buttonName}
        </button>
    );
};

export default CommonButton;