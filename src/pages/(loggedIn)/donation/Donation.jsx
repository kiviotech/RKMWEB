import React from "react";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Donation.scss";
import { Chart, registerables } from "chart.js";
import DonationsHistory from "./DonationsHistory";
import CircularProgress from "./CircularProgress";
import icons from "../../../constants/icons";
import ReceiptDonating from "./ReceiptDonating";
import ReceiptDonated from "./ReceiptDonated";
import { Link } from "react-router-dom";

// Register all components from Chart.js
Chart.register(...registerables);

const Donation = () => {
  const [showReceiptPopup, setShowReceiptPopup] = useState(false); // State to control the popup visibility
  const [showReceiptPopup1, setShowReceiptPopup1] = useState(false);

  // Function to open the popup
  const openPopup = () => {
    setShowReceiptPopup(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setShowReceiptPopup(false);
  };
  // Function to open the popup
  const openPopup1 = () => {
    setShowReceiptPopup1(true);
  };

  // Function to close the popup
  const closePopup1 = () => {
    setShowReceiptPopup1(false);
  };
  const chartData = {
    labels: ["Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Donation",
        data: [10, 15, 32, 29, 20, 22, 15],
        backgroundColor: "transparent",
        borderColor: "#A3D65C",
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

  const toggleReceiptModal = () => {
    setShowReceiptModal(!showReceiptModal);
  };

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

      <div className="donation-details">
        <div className="search-donation">
          <div className="header">
            <h2>Search Donation</h2>
            <button className="add-donor-btn">+ Add New Donor</button>
          </div>
          <form>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <div className="phone-input">
                  <select>
                    <option>+91</option>
                  </select>
                  <input type="text" name="phone" placeholder="9212341902" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Guru Name</label>
                <select name="guruName">
                  <option>John Doe</option>
                  <option>Sam Doe</option>
                  <option>Jane </option>
                  <option>John Mark</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dikshaNumber">Diksha Number</label>
                <input type="text" name="dikshaNumber" placeholder="John Doe" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dikshaDate">Diksha Date</label>
                <input type="date" name="dikshaDate" />
              </div>
              <div className="form-group">
                <label htmlFor="dikshaPlace">Diksha Place</label>
                <select name="dikshaPlace">
                  <option>John Doe</option>
                  <option>Sam Doe</option>
                  <option>Jane </option>
                  <option>John Mark</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="clear-btn">
                Clear
              </button>
              <button type="submit" className="search-btn">
                <span role="img" aria-label="search-icon">
                  <img src={icons.search} alt="" />
                </span>{" "}
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="devotee-details">
          {/* Render DonationsHistory with the button */}
          <DonationsHistory openPopup={openPopup} openPopup1={openPopup1} />

          <Link to="/donationdetail" className="view-more">
            <div className="expand">
              <h3>
                Expand <img src={icons.angleRight} alt="" />
              </h3>
            </div>
          </Link>
        </div>
      </div>

      {showReceiptPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>
              &times;
            </button>
            <ReceiptDonating />
          </div>
        </div>
      )}

      {showReceiptPopup1 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup1}>
              &times;
            </button>
            <ReceiptDonated />
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
