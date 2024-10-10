// DonationsHistoryPage.js
import React from "react";
import { Line } from "react-chartjs-2";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Donation.scss";
import { Chart, registerables } from "chart.js";
import DonationsHistory from "./DonationsHistory";
import CircularProgress from "./CircularProgress";

// Register all components from Chart.js
Chart.register(...registerables);

const Donation = () => {
  // Data for the line chart
  const chartData = {
    labels: ["Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Donation",
        data: [10000, 15000, 32000, 29000, 20000, 22000, 15000],
        backgroundColor: "rgba(39, 174, 96, 0.2)",
        borderColor: "#27ae60",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const circularProgressValue = 46; // 46% for the donated part

  return (
    <div className="donations-history-page">
      {/* Top Section */}
      <div className="top-section">
        {/* Total Donations */}
        <div className="total-donations">
          <div>
            <h2>Total Donations</h2>
            <h3>₹44,567</h3>
            <p>+12.02% than last month</p>
          </div>
          <div className="donation-chart">
            <Line data={chartData} options={chartOptions} height={200} />
            {/* <p>3rd August Total Donation 32.9k</p> */}
          </div>
        </div>

        <div>
          <CircularProgress />
        </div>
      </div>

      {/* Donation History Section */}

      <DonationsHistory />
    </div>
  );
};

export default Donation;
