import React, { useState, useEffect } from "react";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import "./ExportDonations.scss";
import { generateDonationReport } from "./generateDonationReport";

const ExportDonations = () => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = async (reportType) => {
    try {
      const response = await fetchDonations();
      const allDonations = Array.isArray(response)
        ? response
        : response.data || [];

      // Filter donations based on reportType
      const donations = allDonations.filter((donation) => {
        const donationFor = donation.attributes.donationFor?.toUpperCase();
        return reportType === "MATH"
          ? donationFor === "MATH"
          : donationFor === "MISSION";
      });

      const htmlContent = generateDonationReport(donations, reportType);

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
        <button
          className="export-btn"
          onClick={() => setShowExportDropdown(!showExportDropdown)}
        >
          <span className="download-icon">↓</span> Export Donations
        </button>
        {showExportDropdown && (
          <div className="export-dropdown">
            <button
              className="export-option"
              onClick={() => {
                handleExport("MATH");
                setShowExportDropdown(false);
              }}
            >
              Math Report
            </button>
            <button
              className="export-option"
              onClick={() => {
                handleExport("MISSION");
                setShowExportDropdown(false);
              }}
            >
              Mission Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportDonations;
