import React from "react";
import ApplicationDetails from "../applicationDetails/ApplicationDetails";
import GuestDetails from "../GuestDetails/GuestDetails";
import VisitDetails from "../VisitDetails/VisitDetails";
import useApplicationStore from "../../../../../useApplicationStore";

const VerifyDetails = () => {
  const { formData, errors } = useApplicationStore();

  return (
    <>
      <ApplicationDetails formData={formData} errors={errors} />
      <GuestDetails formData={formData} errors={errors} />
      <VisitDetails formData={formData} errors={errors} />
    </>
  );
};

export default VerifyDetails;
