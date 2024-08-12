// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../src/routes/AppRoutes';
import ToastMessage from './components/ToastMessage';

const App = () => {
  return (
    <BrowserRouter>
      <ToastMessage>
        <AppRoutes />
      </ToastMessage>
    </BrowserRouter>
  );
};

export default App;
