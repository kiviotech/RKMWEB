import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import "./ThankYouPage.scss";
import ApplicationFormHeader from "./ApplicationFormHeader";
import ApplicationFormFooter from "./ApplicationFormFooter";

const ThankYouPage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div style={{ backgroundColor: "#fff2ea" }}>
      <ApplicationFormHeader />
      <div className="thank-you-container">
        <div className="thank-you-card">
          <div>
            <FaCheckCircle className="thank-you-check-icon" />
          </div>

          <h1 className="thank-you-heading">
            Thank You for Submitting Guest House Booking Form
          </h1>

          <p className="thank-you-success-message">
            Your booking request has been successfully Registered.
          </p>
          <p className="thank-you-sub-message">
            We will send a confirmation to your email shortly.
          </p>

          <div className="thank-you-contact-section">
            <p className="thank-you-contact-text">Need help? Contact us at:</p>

            <div className="thank-you-contact-item">
              <MdEmail className="thank-you-icon" />
              <a
                href="mailto:guesthouse@kamarpukurmath.org"
                className="thank-you-link"
              >
                guesthouse@kamarpukurmath.org
              </a>
            </div>

            <div className="thank-you-contact-item">
              <MdPhone className="thank-you-icon" />
              <p className="thank-you-link">+91-7872800844</p>
            </div>
          </div>

          <p className="thank-you-footer">
            May Sri Ramakrishna, Holy Mother Sri Sarada Devi and Swami
            Vivekananda bless you all !
          </p>
        </div>
      </div>
      <ApplicationFormFooter />
    </div>
  );
};

export default ThankYouPage;
