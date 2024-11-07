// src/AppRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/(auth)/login/Login";
import Signup from "../pages/(auth)/signup/Signup";
import CheckInDetails from "../pages/(loggedIn)/checkInDetails/CheckInDetails";
import CheckOutDetails from "../pages/(loggedIn)/checkOutDetails/CheckOutDetails";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/(loggedIn)/dashboard/Dashboard";
import ApproveGuests from "../pages/(loggedIn)/approveGuests/ApproveGuests";
import ApplicationForm from "../pages/applicationForm/ApplicationForm";
import AllocateRoom from "../pages/(loggedIn)/allocateRoom/AllocateRoom";
import CheckRoomAvailability from "../pages/(loggedIn)/roomAvailabaity/CheckRoomAvailability";
import BookRoom from "../pages/(loggedIn)/BookRoom/BookRoom";
import Requests from "../pages/(loggedIn)/requests/Requests";
import Donation from "../pages/(loggedIn)/donation/Donation";
import DonationDetail from "../pages/(loggedIn)/donation/DonationDetail";
import ReceiptDonating from "../pages/(loggedIn)/donation/ReceiptDonating";
import ReceiptDonated from "../pages/(loggedIn)/donation/ReceiptDonated";
import ReceiptWarning from "../pages/(loggedIn)/donation/ReceiptWarning"
import DeekshaForm from "../pages/(loggedIn)/donation/DeekshaForm";
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
        {/* <Route path="/approve-guests" element={<ApproveGuests />} /> */}
        <Route path="/room-availability" element={<CheckRoomAvailability />} />
        <Route path="/book-room" element={<BookRoom />} />
        
        <Route path="/Requests" element={<Requests />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/donationdetail" element={<DonationDetail />} />
        <Route path="/receipt-donating" element={<ReceiptDonating />} />
        <Route path="/receipt-donated" element={<ReceiptDonated/>} />
        <Route path="/receipt-warning" element={<ReceiptWarning/>} />

      </Route>

      {/* Route that should render independently */}
      <Route path="/application-form" element={<ApplicationForm />} />
      <Route path="/deeksha-form" element={<DeekshaForm/>} />
    </Routes>
  );
};

export default AppRoutes;
