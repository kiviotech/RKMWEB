import React from "react";
import "./WelcomePage.scss";
import bgImage from "../../assets/image/Kamarpukur.jpg"; // Update this path as needed
import ApplicationFormHeader from "./ApplicationFormHeader";
import ApplicationFormFooter from "./ApplicationFormFooter";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <ApplicationFormHeader />
      <div className="ramakrishna-math">
        <div className="overlay">
          <div className="content">
            <h1>Welcome To Ramakrishna Math Guest House Booking</h1>
            <p>
              Experience spiritual tranquility at our peaceful guest house in
              Kamarpukur,
            </p>
            <p>the birthplace of Sri Ramakrishna</p>
            <button
              className="book-button"
              onClick={() => navigate("/application-form")}
            >
              Please Proceed For Accommodation Request
            </button>
          </div>
        </div>
      </div>
      <ApplicationFormFooter />
    </div>
  );
};

export default WelcomePage;
