import React from "react";
import "./WelcomePage.scss";
import ApplicationFormHeader from "./ApplicationFormHeader";
import ApplicationFormFooter from "./ApplicationFormFooter";
import { useNavigate } from "react-router-dom";
import KRpic from "../../assets/image/KRpic.jpg";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ApplicationFormHeader />
      <div
        style={{
          backgroundImage: `url(${KRpic})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          // minHeight: "calc(100vh - 80px)", // Adjust based on the height of your header and footer
          flex: 1
        }}
      >
        <div className="ramakrishna-math">
          <div className="overlay">
            <div className="content">
              <h1>Welcome To Ramakrishna Math Guest House Booking</h1>
              <p>
                Experience spiritual tranquility at our peaceful guest house in Kamarpukur,
              </p>
              <p>the birthplace of Sri Ramakrishna</p>
              <button className="book-button" onClick={() => navigate('/application-form')}>Request for Stay</button>
            </div>
          </div>
        </div>
      </div>
      <ApplicationFormFooter />
    </div>
  );
};

export default WelcomePage;
