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
    // Change 1: Update the state logic to handle mutual exclusivity
    if (value === true) {
      setYesSelected(true); // Select Yes
    } else {
      setYesSelected(false); // Select No
    }
    updateRelation({ hasInitiatedFamily: value });
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
          src={isYesSelected == true? YesIcon : Yes1Icon}
          alt="Yes"
          onClick={() => handleYesNoSelection(true)}
          className="deeksharelationImageStyle"
        />
       </button>
       <button>
       <img
          src={!isYesSelected ==false ? NoIcon : No1Icon}
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