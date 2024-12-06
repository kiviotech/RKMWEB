// import React from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import useDeekshaFormStore from "../../../../deekshaFormStore"

// const DeekshaContactForm = () => {
//   const navigate = useNavigate();
//   const { contact, updateContact } = useDeekshaFormStore();

//   // Log entire Zustand store when component mounts
//   React.useEffect(() => {
//     const fullStore = useDeekshaFormStore.getState();
//     console.log('Full Deeksha Form Store:', fullStore);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     updateContact({ [name]: value });
//     // Log full store after each update
//     const fullStore = useDeekshaFormStore.getState();
//     console.log('Full Store After Update:', fullStore);
//   };

//   const handleBack = () => {
//     navigate("/deekshaAdress-form"); // Updated route for Back button
//   };

//   const handleNext = () => {
//     alert("Proceeding to the next page...");
//   };

//   return (
//     <div style={{ padding: "40px", fontFamily: "lexend", width: "75%", margin: "0 auto" }}>
//       {/* Progress Bar */}
//       <div style={{
//         height: "5px",
//         background: "#e0e0e0",
//         borderRadius: "2px",
//         marginBottom: "30px",
//         position: "relative",
//       }}>
//         <div style={{ height: "5px", width: "50%", background: "#9867E9", borderRadius: "2px" }} />
//       </div>

//       {/* Title */}
//       <h2 style={{ textAlign: "center", color: "#9867E9", fontSize: "28px", marginBottom: "20px" }}>
//         Srimat Swami Gautamanandaji Maharaj’s Diksha Form
//       </h2>

//       {/* Form */}
//       <form>
//         {/* Phone Number */}
//         <div style={{ marginBottom: "30px" }}>
//           <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//             Please enter your phone number:
//           </label>
//           <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
//             <select
//               style={{
//                 padding: "12px",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//                 fontSize: "16px",
//                 marginRight: "10px",
//               }}
//             >
//               <option value="India">India</option>
//             </select>
//             <input
//               type="text"
//               name="phoneNumber"
//               placeholder="+91 your number"
//               value={contact.phoneNumber}
//               onChange={handleInputChange}
//               style={{
//                 flex: "1",
//                 padding: "12px",
//                 borderRadius: "5px",
//                 border: "1px solid #ccc",
//                 fontSize: "16px",
//               }}
//             />
//           </div>
//         </div>

//         {/* Email ID */}
//         <div style={{ marginBottom: "30px" }}>
//           <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//             Please enter your e-mail id:-
//           </label>
//           <input
//             type="email"
//             name="email"
//             placeholder="noname@nodomain.com"
//             value={contact.email}
//             onChange={handleInputChange}
//             style={{
//               display: "block",
//               marginTop: "10px",
//               padding: "12px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//               width: "100%",
//               fontSize: "16px",
//             }}
//           />
//         </div>

//         {/* Aadhaar Number */}
//         <div style={{ marginBottom: "30px" }}>
//           <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//             Please enter your Aadhaar number:
//           </label>
//           <input
//             type="text"
//             name="aadhaar"
//             placeholder="**** **** 9874"
//             value={contact.aadhaar}
//             onChange={handleInputChange}
//             style={{
//               display: "block",
//               marginTop: "10px",
//               padding: "12px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//               width: "100%",
//               fontSize: "16px",
//             }}
//           />
//         </div>

//         {/* PAN Number */}
//         <div style={{ marginBottom: "30px" }}>
//           <label style={{ fontSize: "18px", fontWeight: "bold" }}>
//             Please enter your PAN number:
//           </label>
//           <input
//             type="text"
//             name="pan"
//             placeholder="*****9874*"
//             value={contact.pan}
//             onChange={handleInputChange}
//             style={{
//               display: "block",
//               marginTop: "10px",
//               padding: "12px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//               width: "100%",
//               fontSize: "16px",
//             }}
//           />
//         </div>
//       </form>

//       {/* Buttons */}
//       <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
//         <button
//           onClick={handleBack}
//           style={{
//             padding: "12px 25px",
//             borderRadius: "5px",
//             border: "none",
//             background: "#e0e0e0",
//             color: "#000",
//             cursor: "pointer",
//             fontSize: "16px",
//           }}
//           onMouseEnter={(e) => (e.target.style.background = "#9A4EFC")}
//           onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//         >
//           Back
//         </button>
//         <Link
//         to="/deekshaEducation-form"
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

// export default DeekshaContactForm;



import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaContactForm.scss"
import { icons } from "../../../constants"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@sweetalert2/theme-dark";


const MySwal = withReactContent(Swal);

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


  const handlePopup = () => {
    
    MySwal.fire({
      text: "Do you want to add  additional Information?",
      imageUrl: icons.informationIcon,
      imageWidth: 70,
      imageHeight: 70,
      imageAlt: "Custom image",
      showCancelButton: true,
      confirmButtonText: "Skip and Submit",
      cancelButtonText: "Continue",
      background: "#ffffff",
      buttonsStyling: false, // Disable SweetAlert2's default button styling
      customClass: {
        confirmButton: "skipButton", // Apply custom class to confirm button
        cancelButton: "cancelButton",
       
      },
      backdrop: `
        rgba(0, 0, 0, 0.4) 
        
        left top
        no-repeat
      `,
      didOpen: () => {
        // Select the confirm and cancel buttons
        const confirmButton = MySwal.getConfirmButton();
        const cancelButton = MySwal.getCancelButton();
  
        // Wrap both buttons in a new div
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        // buttonContainer.style.gap = "10px"; // Space between buttons
        buttonContainer.style.justifyContent = "center"; // Align buttons in the center
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
  
        // Get the popup container and append the button container
        const popup = MySwal.getPopup();
        popup.appendChild(buttonContainer);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/deekshaUpasana-form')
        console.log("Skipped and submitted"); 
        // Replace with actual skip logic
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Continued to additional info"); // Replace with actual continue logic
      }
    });
  };

  // submitPopup

  const handleSubmit = () => {
    // Trigger the SweetAlert2 popup
    Swal.fire({
      text: "Do you want to submit?",
     
      background: "#ffffff",
      showCancelButton: true, 
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel", 
      customClass: {
        confirmButton: "confirmButton", 
        cancelButton: "cancelbutton", 
        popup: "popup", 
      },
      buttonsStyling: false, 
      didOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();
  
       
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "25px"; // 
        buttonContainer.style.justifyContent = "center"; 
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
  
        const popup = Swal.getPopup();
        popup.appendChild(buttonContainer); 
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/deekshaUpasana-form")
        console.log("Form submitted!"); 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Cancel clicked!"); 
      }
    });
  };
  





  return (
    <div className="diksha-form-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" />
      </div>

      {/* Title */}
      <h2 className="title">Srimat Swami Gautamanandaji Maharaj’s Diksha Form</h2>

      {/* Form */}
      <form>
        {/* Phone Number */}
        <div className="form-group">
          <label className="form-label">Please enter your phone number:</label>
          <div className="phone-input">
            <select className="phone-select">
              <option value="India">India</option>
            </select>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+91 your number"
              value={contact.phoneNumber}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div className="switch-wrapper">
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
            {/* <img
              src={icons.whatsapp}
              alt="WhatsApp Icon"
              className="icon"
            /> */}
            <span className="label-text">Is this your WhatsApp number?</span>
          </div>
        </div>





        {/* Email ID */}
        <div className="form-group">
          <label className="form-label">Please enter your e-mail id:</label>
          <input
            type="email"
            name="email"
            placeholder="noname@nodomain.com"
            value={contact.email}
            onChange={handleInputChange}
            className="input-field"
           
          />
        </div>

        {/* Aadhaar Number */}
        <div className="form-group">
          <label className="form-label">Please enter your Aadhaar number:</label>
          <input
            type="text"
            name="aadhaar"
            placeholder="** ** 9874"
            value={contact.aadhaar}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>

        {/* PAN Number */}
        <div className="form-group">
          <label className="form-label">Please enter your PAN number:</label>
          <input
            type="text"
            name="pan"
            placeholder="**9874"
            value={contact.pan}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>
      </form>


      <div className="footer" style={{backgroundColor: '#fff'}}>
        <span  onClick={handleSubmit}>Skip & Submit</span>

        <div className="button-group">
          <button
            onClick={handleBack}
            className="back-button"
          >
            Back
          </button>
          <Link
            to="/deekshaEducation-form"
            className="next-button"
            onClick={handlePopup}
          >
            Next
          </Link>
        </div>

      </div>
    </div>
  );
};

export default DeekshaContactForm;