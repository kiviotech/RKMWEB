import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponsHeader from "./CouponsHeader";
import CouponsSection from "./CouponsSection";
import CouponsContent from "./CouponsContent";
import CouponsDetails from "./CouponsDetails";

const Coupons = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <CouponsHeader />
      <CouponsSection />
      <CouponsContent />
      {/* <CouponsDetails /> */}
    </div>
  );
};

export default Coupons;
