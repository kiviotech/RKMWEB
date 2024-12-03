// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import YesIcon from "../../../assets/icons/YesIcon.png";
// import NoIcon from "../../../assets/icons/NoIcon.png";
// import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
// import No1Icon from "../../../assets/icons/No1Icon.png";
// import useDeekshaFormStore from "../../../../deekshaFormStore"

// // Icons for relationships
// import HusbandIcon from "../../../assets/icons/HusbandIcon.png";
// import WifeIcon from "../../../assets/icons/WifeIcon.png";
// import FatherIcon from "../../../assets/icons/FatherIcon.png";
// import SonIcon from "../../../assets/icons/SonIcon.png";
// import DaughterIcon from "../../../assets/icons/DaughterIcon.png";
// import MotherIcon from "../../../assets/icons/MotherIcon.png";
// import MotherInlawIcon from "../../../assets/icons/MotherInlawIcon.png";
// import FatherInlawIcon from "../../../assets/icons/FatherInlawIcon.png";
// import GrandFatherIcon from "../../../assets/icons/GrandFatherIcon.png";
// import GrandMotherIcon from "../../../assets/icons/GrandMotherIcon.png";

// const DeekshaRelationForm = () => {
//   const updateRelation = useDeekshaFormStore((state) => state.updateRelation);
//   const relation = useDeekshaFormStore((state) => state.relation);
//   const [isYesSelected, setYesSelected] = useState(null); // Default: neither Yes nor No selected
//   const [activeRelation, setActiveRelation] = useState(null);
//   const [isBackClicked, setBackClicked] = useState(false);
//   const navigate = useNavigate();

//   // Back button functionality
//   const handleBack = () => {
//     setBackClicked(true);
//     setTimeout(() => {
//       navigate("/deekshaConsent-form");
//     }, 200); // Navigate after a short delay to show color change
//   };

//   // Update Zustand when Yes/No is selected
//   const handleYesNoSelection = (value) => {
//     setYesSelected(value);
//     updateRelation({ hasInitiatedFamily: value });
//     console.log('Current Store State:', useDeekshaFormStore.getState());
//   };

//   // Update family member details
//   const handleFamilyMemberDetails = (field, value) => {
//     updateRelation({ [field]: value });
//     console.log('Current Store State:', useDeekshaFormStore.getState());
//   };

//   // Update relationship selection
//   const handleRelationSelection = (relation) => {
//     setActiveRelation(relation);
//     updateRelation({ relationship: relation });
//     console.log('Current Store State:', useDeekshaFormStore.getState());
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Lexend" }}>
//       {/* Progress Bar */}
//       <div style={{
//         width: "100%",
//         height: "8px",
//         background: "#E0E0E0",
//         borderRadius: "4px",
//         marginBottom: "20px",
//       }}>
//         <div style={{
//           width: "62.5%", // 5/8 steps
//           height: "100%",
//           background: "#9867E9",
//           borderRadius: "4px",
//         }}></div>
//       </div>

//       {/* Heading */}
//       <h1
//         style={{
//           width: "100%",
//           fontSize: "32px",
//           fontWeight: "600",
//           lineHeight: "40px",
//           textAlign: "center",
//           color: "#9867E9", // Heading color
//         }}
//       >
//         Srimat Swami Gautamanandaji Maharaj’s Diksha Form
//       </h1>

//       {/* Question */}
//       <h2
//         style={{
//           width: "90%", // Adjusted to fit the screen
//           margin: "20px auto",
//           fontSize: "20px", // Reduced font size
//           fontWeight: "500",
//           lineHeight: "30px",
//           textAlign: "left",
//         }}
//       >
//         Is anyone in your family initiated from Ramakrishna Math? If yes, his/her
//         name, relationship, and Guru’s name:
//       </h2>

//       {/* Yes/No Input */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column", // Align vertically
//           gap: "20px",
//           marginTop: "20px",
//         }}
//       >
//         {/* Yes/No Column */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column", // Align vertically
//             gap: "10px",
//             alignItems: "flex-start",
//           }}
//         >
//           <img
//             src={isYesSelected ? YesIcon : Yes1Icon}
//             alt="Yes"
//             onClick={() => handleYesNoSelection(true)}
//             style={{
//               cursor: "pointer",
//               width: "60px",
//               height: "60px",
//             }}
//           />
//           <img
//             src={!isYesSelected ? NoIcon : No1Icon}
//             alt="No"
//             onClick={() => handleYesNoSelection(false)}
//             style={{
//               cursor: "pointer",
//               width: "60px",
//               height: "60px",
//             }}
//           />
//         </div>

//         {/* Conditional Rendering: Show Fields Below Yes/No Buttons */}
//         {isYesSelected && (
//           <div
//             style={{
//               marginTop: "20px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "20px",
//             }}
//           >
//             {/* "If Yes:" Text and Inputs Beside Each Other */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center", // Align items vertically centered
//                 gap: "20px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "20px",
//                   fontWeight: "500",
//                   color: "#000",
//                 }}
//               >
//                 If Yes:
//               </span>

//               {/* Name Field */}
//               <input
//                 type="text"
//                 placeholder="Enter their Name"
//                 value={relation.familyMemberName}
//                 onChange={(e) => handleFamilyMemberDetails('familyMemberName', e.target.value)}
//                 style={{
//                   width: "250px",
//                   height: "56px",
//                   padding: "10px 20px",
//                   borderRadius: "5px",
//                   border: "1px solid #ccc",
//                 }}
//               />

//               {/* Guru Dropdown */}
//               <select
//                 value={relation.familyMemberGuru}
//                 onChange={(e) => handleFamilyMemberDetails('familyMemberGuru', e.target.value)}
//                 style={{
//                   width: "250px",
//                   height: "56px",
//                   padding: "10px 20px",
//                   borderRadius: "5px",
//                   border: "1px solid #ccc",
//                 }}
//               >
//                 <option value="">Select the Guru</option>
//                 <option value="Guru1">Guru1</option>
//                 <option value="Guru2">Guru2</option>
//                 <option value="Guru3">Guru3</option>
//                 <option value="Guru4">Guru4</option>

//                 {/* Add Guru options dynamically */}
//               </select>
//             </div>

//             {/* Specify the Relationship */}
//             <h3
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "500",
//                 lineHeight: "30px",
//               }}
//             >
//               Please specify the relation:
//             </h3>

//             {/* Relationship Icons with Boxes */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(3, 1fr)",
//                 gap: "20px",
//               }}
//             >
//               {[
//                 { label: "Husband", icon: HusbandIcon },
//                 { label: "Wife", icon: WifeIcon },
//                 { label: "Father", icon: FatherIcon },
//                 { label: "Son", icon: SonIcon },
//                 { label: "Daughter", icon: DaughterIcon },
//                 { label: "Mother", icon: MotherIcon },
//                 { label: "Mother-in-law", icon: MotherInlawIcon },
//                 { label: "Father-in-law", icon: FatherInlawIcon },
//                 { label: "Grandfather", icon: GrandFatherIcon },
//                 { label: "Grandmother", icon: GrandMotherIcon },
//               ].map((relation, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleRelationSelection(relation.label)}
//                   style={{
//                     width: "275px",
//                     height: "69px",
//                     border: `2px solid ${
//                       activeRelation === relation.label ? "#9867E9" : "#ccc"
//                     }`, // Change border color on click
//                     borderRadius: "5px",
//                     padding: "10px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "20px",
//                     backgroundColor:
//                       activeRelation === relation.label
//                         ? "#9867E9"
//                         : "transparent", // Change background color on click
//                     color:
//                       activeRelation === relation.label ? "#fff" : "#000", // Change text color on click
//                     cursor: "pointer",
//                   }}
//                 >
//                   <img
//                     src={relation.icon}
//                     alt={relation.label}
//                     style={{
//                       width: "40px", // Reduced icon size
//                       height: "40px", // Reduced icon size
//                     }}
//                   />
//                   <span style={{ fontSize: "18px", fontWeight: "500" }}>
//                     {relation.label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Back and Next Buttons */}
//       <div
//         style={{
//           marginTop: "40px",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <button
//           onClick={handleBack}
//           style={{
//             padding: "12px 25px",
//             borderRadius: "5px",
//             border: "none",
//             background: isBackClicked ? "#9867E9" : "#e0e0e0", // Change color on click
//             color: isBackClicked ? "#fff" : "#000",
//             cursor: "pointer",
//             fontSize: "16px",
//           }}
//         >
//           Back
//         </button>

//         <Link
//           to="/deekshaDuration-form"
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

// export default DeekshaRelationForm;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaRelationForm.scss"
// import YesorNoButton from "../../(loggedIn)/deeksha/YesornoButton"
// Icons for relationships
import HusbandIcon from "../../../assets/icons/HusbandIcon.png";
import WifeIcon from "../../../assets/icons/WifeIcon.png";
import FatherIcon from "../../../assets/icons/FatherIcon.png";
import SonIcon from "../../../assets/icons/SonIcon.png";
import DaughterIcon from "../../../assets/icons/DaughterIcon.png";
import MotherIcon from "../../../assets/icons/MotherIcon.png";
import MotherInlawIcon from "../../../assets/icons/MotherInlawIcon.png";
import FatherInlawIcon from "../../../assets/icons/FatherInlawIcon.png";
import GrandFatherIcon from "../../../assets/icons/GrandFatherIcon.png";
import GrandMotherIcon from "../../../assets/icons/GrandMotherIcon.png";

const DeekshaRelationForm = () => {
  const updateRelation = useDeekshaFormStore((state) => state.updateRelation);
  const relation = useDeekshaFormStore((state) => state.relation);
  const [isYesSelected, setYesSelected] = useState(null); // Default: neither Yes nor No selected
  const [activeRelation, setActiveRelation] = useState(null);
  const [isBackClicked, setBackClicked] = useState(false);
  const navigate = useNavigate();

  // Back button functionality
  const handleBack = () => {
    setBackClicked(true);
    setTimeout(() => {
      navigate("/deekshaConsent-form");
    }, 200); // Navigate after a short delay to show color change
  };

  // Update Zustand when Yes/No is selected
  const handleYesNoSelection = (value) => {
    setYesSelected(value);
    updateRelation({ hasInitiatedFamily: value });
    console.log('Current Store State:', useDeekshaFormStore.getState());
  };

  // Update family member details
  const handleFamilyMemberDetails = (field, value) => {
    updateRelation({ [field]: value });
    console.log('Current Store State:', useDeekshaFormStore.getState());
  };

  // Update relationship selection
  const handleRelationSelection = (relation) => {
    setActiveRelation(relation);
    updateRelation({ relationship: relation });
    console.log('Current Store State:', useDeekshaFormStore.getState());
  };

  return (
    <div className="deekshaRelationForm">
    {/* Progress Bar */}
    <div className="deekshaRelationForm-progressBar">
      <div className="deekshaRelationForm-progressBar-progress"></div>
    </div>

    {/* Heading */}
    <h1 className="deekshaRelationForm-heading">
      Srimat Swami Gautamanandaji Maharaj’s Diksha Form
    </h1>

    {/* Question */}
    <div className="deekshaRelationForm-yesNoInput">
    <p className="deekshaRelationForm-question">
      Is anyone in your family initiated from Ramakrishna Math? If yes,
      his/her name, relationship, and Guru’s name:
    </p>

    {/* Yes/No Input */}
    
      <div className="deekshaRelationForm-yesNoInput-column">
       <button>
       <img
          src={isYesSelected ? YesIcon : Yes1Icon}
          alt="Yes"
          onClick={() => handleYesNoSelection(true)}
          className="deeksharelationImageStyle"
        />
       </button>
       <button>
       <img
          src={!isYesSelected ? NoIcon : No1Icon}
          alt="No"
          onClick={() => handleYesNoSelection(false)}
          className="deeksharelationImageStyle"
        />
       </button>

{/* <YesorNoButton onValueChange={handleYesNoSelection} /> */}
{/* <YesorNoButton/> */}

      </div>

      {/* Conditional Rendering: Show Fields if "Yes" */}
      {isYesSelected && (
        <div className="deekshaRelationForm-yesNoInput-conditionalFields">
          <div className="deekshaRelationForm-yesNoInput-conditionalFields-ifYes">
            <span style={{fontWeight:'bold'}}>If Yes :-</span>

            {/* Name Field */}
            <input
              type="text"
              placeholder="Enter their Name"
              value={relation.familyMemberName}
              onChange={(e) =>
                handleFamilyMemberDetails("familyMemberName", e.target.value)
              }
            />

            {/* Guru Dropdown */}
            <select
              value={relation.familyMemberGuru}
              onChange={(e) =>
                handleFamilyMemberDetails("familyMemberGuru", e.target.value)
              }
            >
              <option value="">Select the Guru</option>
              <option value="Guru1">Guru1</option>
              <option value="Guru2">Guru2</option>
              <option value="Guru3">Guru3</option>
              <option value="Guru4">Guru4</option>
              {/* Add Guru options dynamically */}
            </select>
          </div>

          {/* Specify the Relationship */}
          <h3>Please specify the relation:</h3>

          <div className="deekshaRelationForm-yesNoInput-conditionalFields-relationship-icons">
            {[
              { label: "Husband", icon: HusbandIcon },
              { label: "Wife", icon: WifeIcon }, 
              { label: "Father", icon: FatherIcon }, 
              { label: "Son", icon: SonIcon }, 
              { label: "Daughter", icon: DaughterIcon }, 
              { label: "Mother", icon: MotherIcon }, 
              { label: "Mother-in-law", icon: MotherInlawIcon }, 
              { label: "Father-in-law", icon: FatherInlawIcon }, 
              { label: "GrandFather", icon: GrandFatherIcon },
              { label: "GrandMother", icon: GrandMotherIcon },  
              // Add other relations...
            ].map((relation, index) => (
              <div
                key={index}
                className={`relation-item ${
                  activeRelation === relation.label ? "active" : ""
                }`}
                onClick={() => handleRelationSelection(relation.label)}
              >
                <img src={relation.icon} alt={relation.label}  />
                <span>{relation.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Back and Next Buttons */}
    <div className="deekshaRelationform-button-group">
      <button
        onClick={handleBack}
         className="deekshaRelationform-back-button"
      >
        Back
      </button>
      <Link to="/deekshaDuration-form"   className="deekshaRelationform-next-button">Next</Link>
    </div>
  </div>
  );
};

export default DeekshaRelationForm;