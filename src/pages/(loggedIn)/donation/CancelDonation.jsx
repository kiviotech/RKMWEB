import React, { useState, useEffect } from "react";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import "./ExportDonations.scss";
import { cancelDonationReport } from "./cancelDonationReport";

const CancelDonation = () => {
  const handleCancelClick = async () => {
    try {
      const response = await fetchDonations();
      const allDonations = Array.isArray(response)
        ? response
        : response.data || [];

      // Generate both reports
      const htmlContent = cancelDonationReport(allDonations, "ALL");

      // Create and handle iframe for printing
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      iframe.contentWindow.document.write(htmlContent);
      iframe.contentWindow.document.close();

      iframe.onload = function () {
        try {
          iframe.contentWindow.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (error) {
          console.error("Print error:", error);
        }
      };
    } catch (error) {
      console.error("Error printing donations:", error);
    }
  };

  return (
    <div className="export-container">
      <div className="dropdown-container">
        <button className="export-btn" onClick={handleCancelClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            style={{ marginRight: "4px" }}
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>{" "}
          Cancel Donations Report
        </button>
      </div>
    </div>
  );
};

export default CancelDonation;
