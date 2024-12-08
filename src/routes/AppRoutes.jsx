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
import DeekshaForm from "../pages/(loggedIn)/deeksha/DeekshaForm";
import Deeksha from "../pages/(loggedIn)/deeksha/Deeksha";
import {
  AdminRoute,
  DeekshaRoute,
  SharedRoute,
} from "../components/ProtectedRoute";
import { PublicRoute } from "../components/AuthMiddleware";

import DeekshaAddressForm from "../pages/(loggedIn)/deeksha/DeekshaAddressForm";
import DeekshaContactForm from "../pages/(loggedIn)/deeksha/DeekshaContactForm";
import DeekshaEducationForm from "../pages/(loggedIn)/deeksha/DeekshaEducationForm";
import DeekshaConsentForm from "../pages/(loggedIn)/deeksha/DeekshaConsentForm";
import DeekshaRelationForm from "../pages/(loggedIn)/deeksha/DeekshaRelationForm";
import DeekshaDurationForm from "../pages/(loggedIn)/deeksha/DeekshaDurationForm";
import DeekshaBooksForm from "../pages/(loggedIn)/deeksha/DeekhaBooksForm";
import DeekshaUpasanaForm from "../pages/(loggedIn)/deeksha/DeekshaUpasanaForm";
import DormitoryApplicationForm from "../pages/dormitoryApplicationForm/DormitoryApplicationForm";
import NewDonation from "../pages/(loggedIn)/donation/NewDonation";
import AllDonation from "../pages/(loggedIn)/donation/AllDonation";
import AllDonationDetails from "../pages/(loggedIn)/donation/AllDonationDetails";
import ThankYouPage from "../pages/applicationForm/ThankYouPage";
import WelcomePage from "../pages/applicationForm/WelcomePage";
import Coupons from "../pages/(loggedIn)/coupons/Coupons";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Admin Only Routes */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route path="/coupons" element={<Coupons />} />
        <Route
          path="/check-in"
          element={
            <AdminRoute>
              <CheckInDetails />
            </AdminRoute>
          }
        />
        <Route
          path="/check-out"
          element={
            <AdminRoute>
              <CheckOutDetails />
            </AdminRoute>
          }
        />
        <Route
          path="/allocate-rooms"
          element={
            <AdminRoute>
              <AllocateRoom />
            </AdminRoute>
          }
        />
        <Route
          path="/approve-guests"
          element={
            <AdminRoute>
              <ApproveGuests />
            </AdminRoute>
          }
        />
        <Route
          path="/room-availability"
          element={
            <AdminRoute>
              <CheckRoomAvailability />
            </AdminRoute>
          }
        />
        <Route
          path="/book-room"
          element={
            <AdminRoute>
              <BookRoom />
            </AdminRoute>
          }
        />
        <Route
          path="/Requests"
          element={
            <AdminRoute>
              <Requests />
            </AdminRoute>
          }
        />
        <Route
          path="/donation"
          element={
            <AdminRoute>
              <Donation />
            </AdminRoute>
          }
        />
        <Route
          path="/newDonation"
          element={
            <AdminRoute>
              <NewDonation />
            </AdminRoute>
          }
        />
                <Route
          path="/allDonationDetails"
          element={
            <AdminRoute>
              <AllDonationDetails />
            </AdminRoute>
          }
        />

        <Route
          path="/donationdetail"
          element={
            <AdminRoute>
              <DonationDetail />
            </AdminRoute>
          }
        />

        <Route
          path="/deeksha"
          element={
            <SharedRoute>
              <Deeksha />
            </SharedRoute>
          }
        />
      </Route>
      <Route
        path="/deeksha-form"
        element={
          <SharedRoute>
            <DeekshaForm />
          </SharedRoute>
        }
      />
            <Route
        path="/deekshaAdress-form"
        element={
          <SharedRoute>
            < DeekshaAddressForm />
          </SharedRoute>
        }
      />
      <Route
        path="/deekshaContact-form"
        element={
          <SharedRoute>
            <DeekshaContactForm />
          </SharedRoute>
        }
      />
      <Route
        path="/deekshaEducation-form"
        element={
          <SharedRoute>
            <DeekshaEducationForm />
          </SharedRoute>
        }
      />
      <Route
        path="/deekshaConsent-form"
        element={
          <SharedRoute>
            <DeekshaConsentForm />
          </SharedRoute>
        }
      />
      <Route
        path="/deekshaRelation-form"
        element={
          <SharedRoute>
            <DeekshaRelationForm />
          </SharedRoute>
        }
      />
      <Route
        path="/deekshaDuration-form"
        element={
          <SharedRoute>
            <DeekshaDurationForm
 />
          </SharedRoute>
        }
      />
      <Route
        path="/deekshaBooks-form"
        element={
          <SharedRoute>
            <DeekshaBooksForm
 />
          </SharedRoute>
        }
      />

<Route
        path="/deekshaUpasana-form"
        element={
          <SharedRoute>
            <DeekshaUpasanaForm
 />
          </SharedRoute>
        }
      />

      <Route path="/application-form" element={<ApplicationForm />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/dormitory-application-form" element={<DormitoryApplicationForm />} />
      <Route
          path="/allDonation"
          element={
            <AdminRoute>
              <AllDonation />
            </AdminRoute>
          }
        />
    </Routes>
  );
};

export default AppRoutes;
