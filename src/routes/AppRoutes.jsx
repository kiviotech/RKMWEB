// src/AppRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/(auth)/login/Login';
import Signup from '../pages/(auth)/signup/Signup';
import CheckInDetails from '../pages/(loggedIn)/checkInDetails/CheckInDetails';
import CheckOutDetails from '../pages/(loggedIn)/checkOutDetails/CheckOutDetails';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/(loggedIn)/dashboard/Dashboard';
import AllocateRoom from '../pages/(loggedIn)/allocateRoom/AllocateRoom';
import ApproveGuests from '../pages/(loggedIn)/approveGuests/ApproveGuests';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route path="/check-in" element={<CheckInDetails />} />
        <Route path="/check-out" element={<CheckOutDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/allocate-rooms" element={<AllocateRoom />} />
        <Route path="/requests" element={<ApproveGuests />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;