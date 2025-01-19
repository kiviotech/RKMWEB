import React from "react";
import CouponsDetails from "./CouponsDetails";
import UserCouponsHeader from "./UserCouponsHeader";
import UserCouponsSection from "./UserCouponsSection";

const UserCoupons = () => {
  return (
    <div>
      <UserCouponsHeader />
      <UserCouponsSection />
      <CouponsDetails />
    </div>
  );
};

export default UserCoupons;
