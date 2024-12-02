// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import YesIcon from "../../../assets/icons/YesIcon.png";
// import NoIcon from "../../../assets/icons/NoIcon.png";
// import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
// import No1Icon from "../../../assets/icons/No1Icon.png";
// import useDeekshaFormStore from "../../../../deekshaFormStore"

// const DeekshaConsentForm = () => {
//   const navigate = useNavigate();
//   const { updateConsent, consent } = useDeekshaFormStore();

//   // State management for selections
//   const [spouseConsent, setSpouseConsent] = useState(consent.spouseConsent);
//   const [previousInitiation, setPreviousInitiation] = useState(consent.previousInitiation);

//   // Update handlers
//   const handleSpouseConsent = (value) => {
//     setSpouseConsent(value);
//     updateConsent({ spouseConsent: value });
//     console.log('Updated Deeksha Form Store:', useDeekshaFormStore.getState());
//   };

//   const handlePreviousInitiation = (value) => {
//     setPreviousInitiation(value);
//     updateConsent({ previousInitiation: value });
//     console.log('Updated Deeksha Form Store:', useDeekshaFormStore.getState());
//   };

//   const handleBack = () => {
//     navigate("/deekshaEducation-form");
//   };

//   return (
//     <div
//       style={{
//         padding: "40px",
//         fontFamily: "Lexend",
//         maxWidth: "900px",
//         margin: "0 auto",
//       }}
//     >
//       {/* Progress Bar */}
//       <div
//         style={{
//           width: "100%",
//           height: "16px",
//           background: "#E0E0E0",
//           borderRadius: "46px",
//           marginBottom: "30px",
//         }}
//       >
//         <div
//           style={{
//             width: "50%", // Update this as needed for progress percentage
//             height: "100%",
//             background: "#9867E9",
//             borderRadius: "46px",
//           }}
//         ></div>
//       </div>

//       {/* Headline */}
//       <h1
//         style={{
//           fontFamily: "Lexend",
//           fontSize: "32px",
//           fontWeight: 600,
//           lineHeight: "40px",
//           textAlign: "left",
//         }}
//       >
//         Srimat Swami Gautamanandaji Maharaj’s Diksha Form
//       </h1>

//       {/* First Question */}
//       <div style={{ marginTop: "40px" }}>
//         <p
//           style={{
//             fontFamily: "Lexend",
//             fontSize: "24px",
//             fontWeight: 500,
//             lineHeight: "30px",
//             textAlign: "left",
//           }}
//         >
//           If married and you alone seek initiation, do you have the consent of
//           your spouse?
//         </p>
//         <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
//           {/* Yes Button */}
//           <button
//             onClick={() => handleSpouseConsent("yes")}
//             style={{
//               width: "85px",
//               height: "45px",
//               backgroundImage: `url(${spouseConsent === "yes" ? YesIcon : Yes1Icon})`,
//               backgroundSize: "cover",
//               border: "none",
//               cursor: "pointer",
//             }}
//           ></button>

//           {/* No Button */}
//           <button
//             onClick={() => handleSpouseConsent("no")}
//             style={{
//               width: "85px",
//               height: "45px",
//               backgroundImage: `url(${spouseConsent === "no" ? NoIcon : No1Icon})`,
//               backgroundSize: "cover",
//               border: "none",
//               cursor: "pointer",
//             }}
//           ></button>
//         </div>
//       </div>

//       {/* Second Question */}
//       <div style={{ marginTop: "40px" }}>
//         <p
//           style={{
//             fontFamily: "Lexend",
//             fontSize: "24px",
//             fontWeight: 500,
//             lineHeight: "30px",
//             textAlign: "left",
//           }}
//         >
//           Have you been initiated by anyone earlier?
//         </p>
//         <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
//           {/* Yes Button */}
//           <button
//             onClick={() => handlePreviousInitiation("yes")}
//             style={{
//               width: "85px",
//               height: "45px",
//               backgroundImage: `url(${previousInitiation === "yes" ? YesIcon : Yes1Icon})`,
//               backgroundSize: "cover",
//               border: "none",
//               cursor: "pointer",
//             }}
//           ></button>

//           {/* No Button */}
//           <button
//             onClick={() => handlePreviousInitiation("no")}
//             style={{
//               width: "85px",
//               height: "45px",
//               backgroundImage: `url(${previousInitiation === "no" ? NoIcon : No1Icon})`,
//               backgroundSize: "cover",
//               border: "none",
//               cursor: "pointer",
//             }}
//           ></button>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "flex-end",
//           gap: "20px",
//           marginTop: "30px",
//         }}
//       >
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
//         >
//           Back
//         </button>
//         <Link
//           to="/deekshaRelation-form"
//           style={{
//             padding: "12px 25px",
//             borderRadius: "5px",
//             border: "none",
//             background: "#9A4EFC",
//             color: "#fff",
//             cursor: "pointer",
//             fontSize: "16px",
//             textDecoration: "none",
//             display: "inline-block",
//           }}
//         >
//           Next
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DeekshaConsentForm;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaConsentForm.scss"
// import {icons} from "../../../constants"

const DeekshaConsentForm = () => {
  const navigate = useNavigate();
  const { updateConsent, consent } = useDeekshaFormStore();

  // State management for selections
  const [spouseConsent, setSpouseConsent] = useState(consent.spouseConsent || "");

  const [previousInitiation, setPreviousInitiation] = useState(consent.previousInitiation);

  // Update handlers
  const handleSpouseConsent = (value) => {
    console.log('previous',spouseConsent)
    if (spouseConsent !== value) {
      setSpouseConsent(value); // Select the new value
      updateConsent({ spouseConsent: value });
    } else {
      setSpouseConsent(""); // Deselect the value if clicked again
      updateConsent({ spouseConsent: "" });
    }
    console.log('updated',spouseConsent)

  };
  



  const handlePreviousInitiation = (value) => {
    if (previousInitiation === value) {
      setPreviousInitiation(""); // Deselect the option
      updateConsent({ previousInitiation: "" });
    } else {
      setPreviousInitiation(value); // Select the new value
      updateConsent({ previousInitiation: value });
    }
  };

  const handleBack = () => {
    navigate("/deekshaEducation-form");
  };

  return (
    <div className="deekshaconsentform-container">
      {/* Progress Bar */}
      <div className="deekshaconsentform-progress-bar">
        <div
          className="deekshaconsentform-progress"
          style={{ width: "50%" }} // Adjust dynamically as needed
        ></div>
      </div>

      {/* Headline */}
      <h1>Srimat Swami Gautamanandaji Maharaj’s Diksha Form</h1>

      {/* First Question */}
      <div className="deekshaconsentform-question">
        <p>If married and you alone seek initiation, do you have the consent of your spouse?</p>
        <div className="deekshaconsentform-options">
          {/* Yes Button */}
          <button
            className={`yes ${spouseConsent === "yes" ? "yes-selected" : ""}`}
            onClick={() => handleSpouseConsent("yes")}
          >
            <img
              src={spouseConsent === "yes" ? Yes1Icon : YesIcon}
              className="deekshaconsentformimageStyle"
              alt="Yes"
            />
          </button>

          {/* No Button */}
          <button
            className={`no ${spouseConsent === "no" ? "no-selected" : ""}`}
            onClick={() => handleSpouseConsent("no")}
          >
            <img
              src={spouseConsent === "no" ? No1Icon : NoIcon}
              className="deekshaconsentformimageStyle"
              alt="No"
            />
          </button>
        </div>
      </div>


      {/* Second Question */}
      <div className="deekshaconsentform-question">
        <p>Have you been initiated by anyone earlier?</p>
        <div className="deekshaconsentform-options">
          <button
            className={`yes ${previousInitiation === "yes" ? "yes-selected" : ""
              }`}
            onClick={() => handlePreviousInitiation("yes")}
          >
            <img src={previousInitiation === "yes" ? Yes1Icon : YesIcon} className="deekshaconsentformimageStyle" alt="Yes" />
          </button>

          <button
            className={`no ${previousInitiation === "no" ? "no-selected" : ""}`}
            onClick={() => handlePreviousInitiation("no")}
          >
            <img src={previousInitiation === "no" ? No1Icon : NoIcon} className="deekshaconsentformimageStyle" alt="No" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="deekshaConsentform-button-group">
        <button  onClick={handleBack}    className="deekshaConsentform-back-button" >
          Back
        </button>
        <Link className="deekshaConsentform-next-button" to="/deekshaRelation-form"   >
          Next
        </Link>
      </div>
    </div>
  );
};

export default DeekshaConsentForm;