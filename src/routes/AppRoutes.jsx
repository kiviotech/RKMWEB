import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/(auth)/login/Login";
import Signup from "../pages/(auth)/signup/Signup";
import ForgotPassword from "../pages/(auth)/login/ForgotPassword";
import UserActivityLogs from "../pages/(loggedIn)/admin/UserActivityLogs";
import UserActivityDashboard from "../pages/(loggedIn)/admin/UserActivityDashboard";
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
import PrintWithoutPreview from "../pages/(loggedIn)/donation/printWithoutPreview";
import {
  DeekshaRoute,
  SharedRoute,
  SubAdminRoute,
  SuperAdminRoute,
  DonationRoute,
  GuestHouseRoute,
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

import ConsentLetter from "../pages/(loggedIn)/donation/ConsentLetter";
import UserCoupons from "../pages/(loggedIn)/coupons/UserCoupons";
import BookRoomManagement from "../pages/(loggedIn)/BookRoomManagement/BookRoomManagement";
import Calendar from "../pages/(loggedIn)/Calendar/Calendar";
import BookDormitoryRoom from "../pages/(loggedIn)/BookDormitoryRoom/BookDormitoryRoom";

//Added Components
import UtilityTabs from "../pages/(loggedIn)/utilities/UtilityTabs";
import UserManagement from "../pages/(loggedIn)/UserManagement/UserManagement";
import DonationAuditDashboard from "../pages/(loggedIn)/DonationAuditDashboard/DonationAuditDashboard";
import Notifications from "../pages/(loggedIn)/Notifications/Notifications";
import SuperAdminDashboard from "../pages/(loggedIn)/SuperAdminDashboard/SuperAdminDashboard";


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
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Admin Only Routes */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <GuestHouseRoute>
              <Dashboard />
            </GuestHouseRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <SuperAdminRoute>
              <Coupons />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/user-coupons"
          element={
            <SuperAdminRoute>
              <UserCoupons />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/check-in"
          element={
            <SuperAdminRoute>
              <CheckInDetails />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/check-out"
          element={
            <SuperAdminRoute>
              <CheckOutDetails />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/allocate-room"
          element={
            <GuestHouseRoute>
              <AllocateRoom />
            </GuestHouseRoute>
          }
        />
        <Route
          path="/approveGuests"
          element={
            <GuestHouseRoute>
              <ApproveGuests />
            </GuestHouseRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <SuperAdminRoute>
              <Calendar />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/book-room-management"
          element={
            <SuperAdminRoute>
              <BookRoomManagement />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/check-room-availability"
          element={
            <GuestHouseRoute>
              <CheckRoomAvailability />
            </GuestHouseRoute>
          }
        />
        <Route
          path="/book-room"
          element={
            <SuperAdminRoute>
              <BookRoom />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/book-dormitory-room"
          element={
            <SuperAdminRoute>
              <BookDormitoryRoom />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/Requests"
          element={
            <SuperAdminRoute>
              <Requests />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/donation"
          element={
            <SuperAdminRoute>
              <Donation />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/newDonation"
          element={
            <DonationRoute>
              <NewDonation />
            </DonationRoute>
          }
        />
        <Route
          path="/allDonationDetails"
          element={
            <DonationRoute>
              <AllDonationDetails />
            </DonationRoute>
          }
        />

        <Route
          path="/donationdetail"
          element={
            <SuperAdminRoute>
              <DonationDetail />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/deeksha"
          element={
            <DeekshaRoute>
              <Deeksha />
            </DeekshaRoute>
          }
        />
        <Route path="/utilities" element={<UtilityTabs />} /> {/* Added Route */}
        <Route
          path="/user-management"
          element={
            <SuperAdminRoute>
              <UserManagement />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/donation-audit-dashboard"
          element={
            <SuperAdminRoute>
              <DonationAuditDashboard />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/user-activity-logs"
          element={
            <SuperAdminRoute>
              <UserActivityLogs />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/user-activity-dashboard"
          element={
            <SuperAdminRoute>
              <UserActivityDashboard />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <SuperAdminRoute>
              <Notifications />
            </SuperAdminRoute>
          }
        />
        <Route
          path="/super-admin-dashboard"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          }
        />
      </Route>
      <Route
        path="/deeksha-form"
        element={
          <DeekshaRoute>
            <DeekshaForm />
          </DeekshaRoute>
        }
      />
      <Route
        path="/deekshaAdress-form"
        element={
          <DeekshaRoute>
            <DeekshaAddressForm />
          </DeekshaRoute>
        }
      />
      <Route
        path="/deekshaContact-form"
        element={
          <DeekshaRoute>
            <DeekshaContactForm />
          </DeekshaRoute>
        }
      />
      <Route
        path="/deekshaEducation-form"
        element={
          <DeekshaRoute>
            <DeekshaEducationForm />
          </DeekshaRoute>
        }
      />
      <Route
        path="/deekshaConsent-form"
        element={
          <DeekshaRoute>
            <DeekshaConsentForm />
          </DeekshaRoute>
        }
      />
      <Route
        path="/deekshaRelation-form"
        element={
          <DeekshaRoute>
            <DeekshaRelationForm />
          </DeekshaRoute>
        }
      />
      <Route
        path="/deekshaDuration-form"
        element={
          <DeekshaRoute>
            <DeekshaDurationForm />
          </DeekshaRoute>
        }
      />
      <Route
        path="/deekshaBooks-form"
        element={
          <DeekshaRoute>
            <DeekshaBooksForm />
          </DeekshaRoute>
        }
      />

      <Route
        path="/deekshaUpasana-form"
        element={
          <DeekshaRoute>
            <DeekshaUpasanaForm />
          </DeekshaRoute>
        }
      />

      <Route path="/application-form" element={<ApplicationForm />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route
        path="/dormitory-application-form"
        element={<DormitoryApplicationForm />}
      />
      <Route path="/consent-letter" element={<ConsentLetter />} />
      <Route path="/print-without-preview" element={<PrintWithoutPreview />} />
      <Route
        path="/allDonation"
        element={
          <SuperAdminRoute>
            <AllDonation />
          </SuperAdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;