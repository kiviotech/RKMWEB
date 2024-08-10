import React from 'react';

const CommonButton = ({ buttonName, style, buttonWidth, onClick }) => {
    const defaultStyle = {
        width: buttonWidth || 'auto',

        borderRadius: `${style.broderRadius}`,
        border: `${style.borderWidth}px solid ${style.color}`,
        backgroundColor: '#9866E9',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '500',
        fontFamily: 'Lexend',
        fontSize: `${style.fontSize}`,
        ...style,
    };

    return (
        <button style={defaultStyle} onClick={onClick}>
            {buttonName}
        </button>
    );
};

export default CommonButton;