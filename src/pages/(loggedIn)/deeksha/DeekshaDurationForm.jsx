import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaDurationForm.scss";

const DeekshaDurationForm = () => {
  const { duration, updateDuration } = useDeekshaFormStore();
  const navigate = useNavigate();

  // Initialize state from Zustand store
  const [yesIsAcquainted, setYesIsAcquainted] = useState(null);
  const [selectedSwami, setSelectedSwami] = useState(duration.selectedSwami);
  const [selectedCentre, setSelectedCentre] = useState(duration.selectedCentre);
  const [eagerDuration, setEagerDuration] = useState(duration.eagerDuration);
  const [otherDuration, setOtherDuration] = useState(duration.otherDuration);
  const [isBackClicked, setBackClicked] = useState(false);
const [noIsAcquainted,setNoIsAcquainted]=useState(false);
  // Update Zustand store whenever form values change
  useEffect(() => {
    updateDuration({
      //isAcquainted,
      yesIsAcquainted,
      noIsAcquainted,
      selectedSwami,
      selectedCentre,
      eagerDuration,
      otherDuration,
    });
    // Log entire Zustand store
    // console.log("Current Deeksha Form State:", useDeekshaFormStore.getState());
  }, [yesIsAcquainted,noIsAcquainted, selectedSwami, selectedCentre, eagerDuration, otherDuration]);

  const handleIsAcquaintedSelection = (value) => {
    // setYesIsAcquainted(value); // Set the isAcquainted state
    // setNoIsAcquainted(value);
    // updateDuration({ yesIsAcquainted : value }); // Update the Zustand store with the new value

     // Change 1: Updated this function for mutual exclusivity

    // if (value) {
    //   setYesIsAcquainted(true); // Select Yes
    //   setNoIsAcquainted(false); // Deselect No
    //   updateDuration({ yesIsAcquainted: true, noIsAcquainted: false }); // Update Zustand
    // } else {
    //   setYesIsAcquainted(false); // Deselect Yes
    //   setNoIsAcquainted(true); // Select No
    //   updateDuration({ yesIsAcquainted: false, noIsAcquainted: true }); // Update Zustand
    // }

    if (value) {
      if (yesIsAcquainted) {
        setYesIsAcquainted(false); // Toggle Yes to unselected if already selected
        updateDuration({ yesIsAcquainted: false, noIsAcquainted }); // Update Zustand
      } else {
        setYesIsAcquainted(true); // Select Yes
        setNoIsAcquainted(false); // Deselect No
        updateDuration({ yesIsAcquainted: true, noIsAcquainted: false }); // Update Zustand
      }
    } else {
      if (noIsAcquainted) {
        setNoIsAcquainted(false); // Toggle No to unselected if already selected
        updateDuration({ yesIsAcquainted, noIsAcquainted: false }); // Update Zustand
      } else {
        setYesIsAcquainted(false); // Deselect Yes
        setNoIsAcquainted(true); // Select No
        updateDuration({ yesIsAcquainted: false, noIsAcquainted: true }); // Update Zustand
      }
    }

    console.log("Updated data:", useDeekshaFormStore.getState()); // Log the updated store for debugging
  };

  
  

  // Back button functionality
  const handleBack = () => {
    setBackClicked(true);
    setTimeout(() => {
      navigate("/deekshaRelation-form");
    }, 200); // Navigate after a short delay to show color change
  };

  return (
    <div className="deekshadurationform">
      {/* Progress Bar */}
      <div className="deekshadurationform-progressBar">
        <div className="deekshadurationform-progressBar-progress"></div>
      </div>

      {/* Heading */}
      <h1 className="deekshadurationform-heading">
        Srimat Swami Gautamanandaji Maharaj's Diksha Form
      </h1>

      {/* Question: Are you acquainted? */}
      <p className="deekshadurationform-question">
        Are you acquainted with any Swami of the Ramakrishna Math/Mission? If yes, name the Swami and his centre.
      </p>
      <div className="deekshadurationform-yesNoInput">
        {/* Yes Button */}
        <button
          onClick={() => handleIsAcquaintedSelection(true)} // Set isAcquainted to true when "Yes" is clicked
          className={yesIsAcquainted === true ? "active" : "  "} // Add 'active' class when isAcquainted is true
        >
          <img
            src={yesIsAcquainted  ? YesIcon : Yes1Icon} // Show active icon when true
            alt="Yes"
          />
        </button>
        
        {/* No Button */}
        <button
          onClick={() => handleIsAcquaintedSelection(false)} // Set isAcquainted to false when "No" is clicked
          className={noIsAcquainted === false ? 'active' : ''} // Add 'active' class when isAcquainted is false
        >
          <img
            src={noIsAcquainted === false ? NoIcon : No1Icon} // Show active icon when false
            alt="No"
          />
        </button>
      </div>

      {/* Conditional Dropdowns */}
      {yesIsAcquainted === true && (
        <div className="deekshadurationform-conditionalFields">
          <p>If yes :-</p>
          <div className="selectContainer">
            <select
              value={selectedSwami}
              onChange={(e) => setSelectedSwami(e.target.value)}
            >
              <option value="">Select the Swami</option>
              <option value="Guru 1">Guru 1</option>
              <option value="Guru 2">Guru 2</option>
              <option value="Guru 3">Guru 3</option>
              <option value="Guru 4">Guru 4</option>
            </select>
          </div>
          <div className="selectContainer">
            <select
              value={selectedCentre}
              onChange={(e) => setSelectedCentre(e.target.value)}
            >
              <option value="">Select the Centre</option>
              <option value="Centre1">Centre 1</option>
              <option value="Centre2">Centre 2</option>
            </select>
          </div>
        </div>
      )}

      {/* Question: Duration */}
      <p className="deekshadurationform-question">
        How long have you been eager for initiation from Ramakrishna Math?
      </p>
      <div className="deekshadurationform-durationOptions">
        {["1 month", "2 months", "3 months", "6 months", "9 months", "Others"].map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="eagerDuration"
              value={option}
              checked={eagerDuration === option}
              onChange={() => setEagerDuration(option)}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Other Duration Input */}
      {eagerDuration === "Others" && (
        <div className="deekshadurationform-otherDurationInput">
          <p style={{ fontWeight: "bold" }}>If others:</p>
          <input
            type="text"
            placeholder="Please enter specific time"
            value={otherDuration}
            onChange={(e) => setOtherDuration(e.target.value)}
          />
        </div>
      )}

      {/* Back and Next Buttons */}
      <div className="deekshadurationform-button-group">
        <button onClick={handleBack} className="deekshadurationform-back-button">
          Back
        </button>

        <Link to="/deekshaBooks-form" className="deekshadurationform-next-button">
          Next
        </Link>
      </div>
    </div>
  );
};

export default DeekshaDurationForm;