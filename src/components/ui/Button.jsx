import React from "react";

const CommonButton = ({
  buttonName,
  style = {},
  buttonWidth = "auto",
  onClick,
}) => {
  const defaultStyle = {
    width: buttonWidth,
    borderRadius: style.borderRadius || "7px", // Corrected the typo and added default value
    border: `${style.borderWidth || 1}px solid ${style.borderColor || "black"}`, // Set defaults if not provided
    backgroundColor: style.backgroundColor || "#9866E9", // Default background
    color: style.color || "white", // Default color
    cursor: "pointer",
    fontWeight: "500",
    fontFamily: "Lexend", // Assuming you are using this font
    fontSize: style.fontSize || "16px", // Default font size
    padding: style.padding || "5px", // Default padding
    ...style, // Spread any additional custom styles
  };

  return (
    <button style={defaultStyle} onClick={onClick}>
      {buttonName}
    </button>
  );
};

export default CommonButton;
