import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore"

const DeekshaDurationForm = () => {
  const { duration, updateDuration } = useDeekshaFormStore();
  const navigate = useNavigate();

  // Initialize state from Zustand store
  const [isAcquainted, setIsAcquainted] = useState(duration.isAcquainted);
  const [selectedSwami, setSelectedSwami] = useState(duration.selectedSwami);
  const [selectedCentre, setSelectedCentre] = useState(duration.selectedCentre);
  const [eagerDuration, setEagerDuration] = useState(duration.eagerDuration);
  const [otherDuration, setOtherDuration] = useState(duration.otherDuration);
  const [isBackClicked, setBackClicked] = useState(false);

  // Update Zustand store whenever form values change
  useEffect(() => {
    updateDuration({
      isAcquainted,
      selectedSwami,
      selectedCentre,
      eagerDuration,
      otherDuration,
    });
    // Log entire Zustand store
    console.log("Current Deeksha Form State:", useDeekshaFormStore.getState());
  }, [isAcquainted, selectedSwami, selectedCentre, eagerDuration, otherDuration]);

  // Back button functionality
  const handleBack = () => {
    setBackClicked(true);
    setTimeout(() => {
      navigate("/deekshaRelation-form");
    }, 200); // Navigate after a short delay to show color change
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Lexend" }}>
      {/* Progress Bar */}
      <div style={{
        width: "100%",
        height: "8px",
        background: "#E0E0E0",
        borderRadius: "4px",
        marginBottom: "20px",
      }}>
        <div style={{
          width: "75%", // 6/8 steps
          height: "100%",
          background: "#9867E9",
          borderRadius: "4px",
        }}></div>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "Lexend",
          fontSize: "32px",
          fontWeight: "600",
          lineHeight: "40px",
          textAlign: "center",
          color: "#9867E9",
        }}
      >
        Srimat Swami Gautamanandaji Maharaj's Diksha Form
      </h1>

      {/* Question: Are you acquainted? */}
      <p
        style={{
          fontSize: "24px",
          fontWeight: "500",
          lineHeight: "30px",
          marginTop: "40px",
        }}
      >
        Are you acquainted with any Swami of the Ramakrishna Math/Mission? If
        yes, name the Swami and his centre.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        <img
          src={isAcquainted === "yes" ? YesIcon : Yes1Icon}
          alt="Yes"
          onClick={() => setIsAcquainted("yes")}
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
          }}
        />
        <img
          src={isAcquainted === "no" ? NoIcon : No1Icon}
          alt="No"
          onClick={() => setIsAcquainted("no")}
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Conditional Dropdowns */}
      {isAcquainted === "yes" && (
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "30px",
              color: "#000",
            }}
          >
            If yes:
          </p>
          <select
            value={selectedSwami}
            onChange={(e) => setSelectedSwami(e.target.value)}
            style={{
              width: "423px",
              height: "56px",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select the Swami</option>
            <option value="Guru 1">Guru 1</option>
            <option value="Guru 2">Guru 2</option>
            <option value="Guru 3">Guru 3</option>
            <option value="Guru 4">Guru 4</option>
          </select>
          <select
            value={selectedCentre}
            onChange={(e) => setSelectedCentre(e.target.value)}
            style={{
              width: "423px",
              height: "56px",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select the Centre</option>
            <option value="Centre1">Centre 1</option>
            <option value="Centre2">Centre 2</option>
          </select>
        </div>
      )}

      {/* Question: Duration */}
      <p
        style={{
          fontSize: "24px",
          fontWeight: "500",
          lineHeight: "30px",
          marginTop: "40px",
        }}
      >
        How long have you been eager for initiation from Ramakrishna Math?
      </p>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "10px" }}>
        {["1 month", "2 months", "3 months", "6 months", "9 months", "Others"].map((option) => (
          <label key={option} style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              name="eagerDuration"
              value={option}
              checked={eagerDuration === option}
              onChange={() => setEagerDuration(option)}
              style={{
                marginRight: "5px",
                cursor: "pointer",
                accentColor: "#9867E9",
                transform: "scale(1.5)", // Increase checkbox size
              }}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Other Duration Input */}
      {eagerDuration === "Others" && (
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "20px" }}>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "30px",
              color: "#000",
            }}
          >
            If others:
          </p>
          <input
            type="text"
            placeholder="Please enter specific time"
            value={otherDuration}
            onChange={(e) => setOtherDuration(e.target.value)}
            style={{
              width: "351px",
              height: "56px",
              padding: "10px 20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              borderBottom: "1px solid #000",
            }}
          />
        </div>
      )}

      {/* Back and Next Buttons */}
      <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handleBack}
          style={{
            padding: "12px 25px",
            borderRadius: "5px",
            border: "none",
            background: isBackClicked ? "#9867E9" : "#e0e0e0", // Change color on click
            color: isBackClicked ? "#fff" : "#000",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Back
        </button>

        <Link
          to="/deekshaBooks-form"
          style={{
            padding: "12px 25px",
            borderRadius: "5px",
            border: "none",
            background: "#9A4EFC",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default DeekshaDurationForm;

