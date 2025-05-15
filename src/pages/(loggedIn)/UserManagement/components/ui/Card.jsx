import React from 'react';
import './shadcn.scss';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`shadcn-card ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`shadcn-card-header ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`shadcn-card-title ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`shadcn-card-description ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`shadcn-card-content ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`shadcn-card-footer ${className}`}>
      {children}
    </div>
  );
};
