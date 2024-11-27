import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import useDeekshaFormStore from "../../../../deekshaFormStore"

const DeekshaContactForm = () => {
  const navigate = useNavigate();
  const { contact, updateContact } = useDeekshaFormStore();

  // Log entire Zustand store when component mounts
  React.useEffect(() => {
    const fullStore = useDeekshaFormStore.getState();
    console.log('Full Deeksha Form Store:', fullStore);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateContact({ [name]: value });
    // Log full store after each update
    const fullStore = useDeekshaFormStore.getState();
    console.log('Full Store After Update:', fullStore);
  };

  const handleBack = () => {
    navigate("/deekshaAdress-form"); // Updated route for Back button
  };

  const handleNext = () => {
    alert("Proceeding to the next page...");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "lexend", width: "75%", margin: "0 auto" }}>
      {/* Progress Bar */}
      <div style={{
        height: "5px",
        background: "#e0e0e0",
        borderRadius: "2px",
        marginBottom: "30px",
        position: "relative",
      }}>
        <div style={{ height: "5px", width: "50%", background: "#9867E9", borderRadius: "2px" }} />
      </div>

      {/* Title */}
      <h2 style={{ textAlign: "center", color: "#9867E9", fontSize: "28px", marginBottom: "20px" }}>
        Srimat Swami Gautamanandaji Maharaj’s Diksha Form
      </h2>

      {/* Form */}
      <form>
        {/* Phone Number */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Please enter your phone number:
          </label>
          <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <select
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
                marginRight: "10px",
              }}
            >
              <option value="India">India</option>
            </select>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+91 your number"
              value={contact.phoneNumber}
              onChange={handleInputChange}
              style={{
                flex: "1",
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </div>
        </div>

        {/* Email ID */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Please enter your e-mail id:-
          </label>
          <input
            type="email"
            name="email"
            placeholder="noname@nodomain.com"
            value={contact.email}
            onChange={handleInputChange}
            style={{
              display: "block",
              marginTop: "10px",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Aadhaar Number */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Please enter your Aadhaar number:
          </label>
          <input
            type="text"
            name="aadhaar"
            placeholder="**** **** 9874"
            value={contact.aadhaar}
            onChange={handleInputChange}
            style={{
              display: "block",
              marginTop: "10px",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "16px",
            }}
          />
        </div>

        {/* PAN Number */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ fontSize: "18px", fontWeight: "bold" }}>
            Please enter your PAN number:
          </label>
          <input
            type="text"
            name="pan"
            placeholder="*****9874*"
            value={contact.pan}
            onChange={handleInputChange}
            style={{
              display: "block",
              marginTop: "10px",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "16px",
            }}
          />
        </div>
      </form>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        <button
          onClick={handleBack}
          style={{
            padding: "12px 25px",
            borderRadius: "5px",
            border: "none",
            background: "#e0e0e0",
            color: "#000",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#9A4EFC")}
          onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
        >
          Back
        </button>
        <Link
        to="/deekshaEducation-form"
          style={{
            padding: "12px 25px", borderRadius: "5px", border: "none", background: "#9A4EFC", color: "#fff", cursor: "pointer", fontSize: "16px"
          }}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default DeekshaContactForm;
