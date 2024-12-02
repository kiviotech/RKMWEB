// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import useDeekshaFormStore from "../../../../deekshaFormStore"

// const DeekshaAddressForm = () => {
//   const { address, updateAddress } = useDeekshaFormStore();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     updateAddress({ [name]: value });
//   };

//   const fetchAddressFromPincode = async (pincode) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
//       if (response.data[0].Status === "Success") {
//         const addressData = response.data[0].PostOffice[0];
//         updateAddress({
//           country: "India",
//           state: addressData.State,
//           district: addressData.District,
//         });
//       } else {
//         alert("Invalid Pincode or no data available");
//       }
//     } catch (error) {
//       console.error("Error fetching address data", error);
//       alert("Failed to fetch address data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePincodeChange = (e) => {
//     const { value } = e.target;
//     updateAddress({ pincode: value });

//     if (value.length === 6) {
//       fetchAddressFromPincode(value);
//     }
//   };

//   const handleBack = () => {
//     navigate("/deeksha-form");
//   };

// //   const handleNext = () => {
// //     navigate("/deeksha-form");
// //   };

//   // Add console.log to see store state
//   console.log('DeekshaAddressForm Store State:', useDeekshaFormStore.getState());

//   // Add progress calculation function
//   const calculateProgress = () => {
//     const requiredFields = ['pincode', 'country', 'state', 'district', 'houseNumber', 'streetName'];
//     const filledFields = requiredFields.filter(field => address[field]?.trim());
//     return (filledFields.length / requiredFields.length) * 25; // 25% is the max for this form
//   };

//   return (
//     <div style={{ padding: "40px", fontFamily: "lexend", width: "75%", margin: "0 auto" }}>
//       {/* Progress Bar */}
//       <div style={{
//         width: "100%",
//         height: "8px",
//         background: "#E0E0E0",
//         borderRadius: "4px",
//         marginBottom: "20px",
//       }}>
//         <div style={{
//           width: `${calculateProgress()}%`, // Dynamic progress
//           height: "100%",
//           background: "#9867E9",
//           borderRadius: "4px",
//           transition: "width 0.3s ease-in-out", // Smooth transition
//         }}></div>
//       </div>

//       {/* Title */}
//       <h2 style={{ textAlign: "center", color: "#9A4EFC", fontSize: "28px", marginBottom: "20px" }}>
//         Srimat Swami Gautamanandaji Maharaj’s Diksha Form
//       </h2>

//       {/* Form */}
//       <form>
//         <div style={{ marginBottom: "30px" }}>
//           <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//             Please enter address pincode: 
//             <input
//               type="text"
//               name="pincode"
//               value={address.pincode}
//               onChange={handlePincodeChange}
//               style={{
//                 marginLeft: "10px", padding: "12px", borderRadius: "5px", border: "1px solid #ccc", width: "250px", fontSize: "16px"
//               }}
//             />
//           </label>
//         </div>

//         {/* Display country, state, and district */}
//         <div style={{ display: "flex", gap: "30px", marginBottom: "30px" }}>
//           <div>
//             <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//               Country <span style={{ color: "red" }}>*</span>
//               <input
//                 type="text"
//                 name="country"
//                 value={address.country}
//                 onChange={handleInputChange}
//                 disabled
//                 style={{
//                   display: "block", marginTop: "5px", padding: "12px", borderRadius: "5px", border: "1px solid #ccc", width: "250px", fontSize: "16px"
//                 }}
//               />
//             </label>
//           </div>
//           <div>
//             <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//               State <span style={{ color: "red" }}>*</span>
//               <input
//                 type="text"
//                 name="state"
//                 value={address.state}
//                 onChange={handleInputChange}
//                 disabled
//                 style={{
//                   display: "block", marginTop: "5px", padding: "12px", borderRadius: "5px", border: "1px solid #ccc", width: "250px", fontSize: "16px"
//                 }}
//               />
//             </label>
//           </div>
//           <div>
//             <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//               District <span style={{ color: "red" }}>*</span>
//               <input
//                 type="text"
//                 name="district"
//                 value={address.district}
//                 onChange={handleInputChange}
//                 disabled
//                 style={{
//                   display: "block", marginTop: "5px", padding: "12px", borderRadius: "5px", border: "1px solid #ccc", width: "250px", fontSize: "16px"
//                 }}
//               />
//             </label>
//           </div>
//         </div>

//         {/* House number and street name side by side */}
//         <div style={{ marginBottom: "30px" }}>
//           <div style={{ display: "flex", gap: "30px" }}>
//             <div style={{ width: "50%" }}>
//               <div style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
//                 House Number:
//               </div>
//               <input
//                 type="text"
//                 name="houseNumber"
//                 placeholder="House Number"
//                 value={address.houseNumber}
//                 onChange={handleInputChange}
//                 style={{
//                   padding: "12px", borderRadius: "5px", border: "1px solid #ccc", width: "100%", fontSize: "16px"
//                 }}
//               />
//             </div>
//             <div style={{ width: "50%" }}>
//               <div style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
//                 Street Name:
//               </div>
//               <input
//                 type="text"
//                 name="streetName"
//                 placeholder="Street Name"
//                 value={address.streetName}
//                 onChange={handleInputChange}
//                 style={{
//                   padding: "12px", borderRadius: "5px", border: "1px solid #ccc", width: "100%", fontSize: "16px"
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </form>

//       {/* Buttons */}
//       <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
//         <button
//           onClick={handleBack}
//           style={{
//             padding: "12px 25px", borderRadius: "5px", border: "none", background: "#e0e0e0", color: "#000", cursor: "pointer", fontSize: "16px"
//           }}
//         >
//           Back
//         </button>
//         <Link
//         to="/deekshaContact-form"
//           style={{
//             padding: "12px 25px", borderRadius: "5px", border: "none", background: "#9A4EFC", color: "#fff", cursor: "pointer", fontSize: "16px"
//           }}
//         >
//           Next
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DeekshaAddressForm;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaAddressForm.scss"

const DeekshaAddressForm = () => {
  const { address, updateAddress } = useDeekshaFormStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateAddress({ [name]: value });
  };

  const fetchAddressFromPincode = async (pincode) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
      if (response.data[0].Status === "Success") {
        const addressData = response.data[0].PostOffice[0];
        updateAddress({
          country: "India",
          state: addressData.State,
          district: addressData.District,
        });
      } else {
        alert("Invalid Pincode or no data available");
      }
    } catch (error) {
      console.error("Error fetching address data", error);
      alert("Failed to fetch address data");
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (e) => {
    const { value } = e.target;
    updateAddress({ pincode: value });

    if (value.length === 6) {
      fetchAddressFromPincode(value);
    }
  };

  const handleBack = () => {
    navigate("/deeksha-form");
  };

//   const handleNext = () => {
//     navigate("/deeksha-form");
//   };

  // Add console.log to see store state
  console.log('DeekshaAddressForm Store State:', useDeekshaFormStore.getState());

  // Add progress calculation function
  const calculateProgress = () => {
    const requiredFields = ['pincode', 'country', 'state', 'district', 'houseNumber', 'streetName'];
    const filledFields = requiredFields.filter(field => address[field]?.trim());
    return (filledFields.length / requiredFields.length) * 25; // 25% is the max for this form
  };

  return (
    <div className="deekshaAddressform-container">
    {/* Progress Bar */}
    <div className="deekshaAddressform-progress-bar">
      <div
        className="deekshaAddressform-progress"
        style={{ "--progress": calculateProgress() }}
      ></div>
    </div>
  
    {/* Title */}
    <h2>Srimat Swami Gautamanandaji Maharaj’s Diksha Form</h2>
  
    {/* Form */}
    <form>
      <div className="deekshaAddressform-input-group">
        <label>
          Please enter address pincode:
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handlePincodeChange}
            
          />
        </label>
      </div>
  
      {/* Display country, state, and district */}
      <div className="deekshaAddressform-address-group">
        <div className="deekshaAddressform-input-wrapper">
          <label>
            Country <span style={{ color: "red" }}>*</span>
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleInputChange}
              disabled
            />
          </label>
        </div>
        <div className="deekshaAddressform-input-wrapper">
          <label>
            State <span style={{ color: "red" }}>*</span>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleInputChange}
              disabled
            />
          </label>
        </div>
        <div className="deekshaAddressform-input-wrapper">
          <label>
            District <span style={{ color: "red" }}>*</span>
            <input
              type="text"
              name="district"
              value={address.district}
              onChange={handleInputChange}
              disabled
            />
          </label>
        </div>
      </div>
  
      {/* House number and street name side by side */}
      <div className="deekshaAddressform-house-street">
        <div className="deekshaAddressform-house-number">
          <div className="deekshaAddressform-label">House Number:</div>
          <input
            type="text"
            name="houseNumber"
            placeholder="House Number"
            value={address.houseNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="deekshaAddressform-street-name">
          <div className="deekshaAddressform-label">Street Name:</div>
          <input
            type="text"
            name="streetName"
            placeholder="Street Name"
            value={address.streetName}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </form>
  
    {/* Buttons */}
    <div className="deekshaAddressform-button-group">
      <button
        className="deekshaAddressform-back-button"
        onClick={handleBack}
      >
        Back
      </button>
      <Link
        to="/deekshaContact-form"
        className="deekshaAddressform-next-button"
      >
        Next
      </Link>
    </div>
  </div>
  
  
  );
};

export default DeekshaAddressForm;