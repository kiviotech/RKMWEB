import React from 'react';
import './shadcn.scss';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const variantClass = `shadcn-btn-${variant}`;
  const sizeClass = `shadcn-btn-${size}`;
  
  return (
    <button
      className={`shadcn-btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
