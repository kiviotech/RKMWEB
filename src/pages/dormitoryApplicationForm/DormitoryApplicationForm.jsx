import React, { useState, useEffect } from "react";
import "./DormitoryApplicationForm.scss";
import useDormitoryStore from "../../../dormitoryStore";
import DormitoryAccommodationDetails from "./dormitoryApplicationTabs/DormitoryAccommodationDetails/DormitoryAccommodationDetails";
import DormitoryApplicationDetails from "./dormitoryApplicationTabs/DormitoryApplicationDetails/DormitoryApplicationDetails";
import DormitoryVerifyDetails from "./dormitoryApplicationTabs/DormitoryVerifyDetails/DormitoryVerifyDetails";
import DormitoryVisitDetails from "./dormitoryApplicationTabs/DormitoryVisitDetails/DormitoryVisitDetails";

const DormitoryApplicationForm = () => {
  const { formData } = useDormitoryStore();
  const tabs = [
    {
      id: 1,
      tabName: "Application Details",
    },
    {
      id: 2,
      tabName: "Accommodation details",
    },
    {
      id: 3,
      tabName: "Visit Details",
    },
    {
      id: 4,
      tabName: "Verify Details",
    },
  ];
  const [visited, setVisited] = useState(null);
  const [activeTab, setActiveTab] = useState("Guest 1");
  const [guestTabs, setGuestTabs] = useState(["Guest 1"]);
  const [progress, setProgress] = useState(0);

  // Calculate progress based on filled fields
  const calculateProgress = () => {
    let totalFields = 0;
    let filledFields = 0;

    // Personal Details
    const personalFields = [
      "title",
      "institutionName",
      "contactPersonName",
      "institutionType",
      "age",
      "gender",
      "email",
      "deeksha",
      "aadhaar",
      "phoneNumber",
    ];
    totalFields += personalFields.length;
    personalFields.forEach((field) => {
      if (formData[field]) filledFields++;
    });

    // Address Fields
    const addressFields = ["state", "district", "streetName", "pinCode", "houseNumber"];
    totalFields += addressFields.length;
    addressFields.forEach((field) => {
      if (formData.address?.[field]) filledFields++;
    });

    // Accommodation Details
    const accommodationFields = ["totalPeople", "maleDevotees", "femaleDevotees"];
    totalFields += accommodationFields.length;
    accommodationFields.forEach((field) => {
      if (formData.accommodation?.[field]) filledFields++;
    });

    // Visit Details
    const visitFields = ["visitDate", "visitTime", "departureDate", "departureTime", "visited"];
    totalFields += visitFields.length;
    visitFields.forEach((field) => {
      if (formData.visitDetails?.[field]) filledFields++;
    });

    // If previously visited, count reason and file
    if (formData.visitDetails?.visited === "yes") {
      totalFields += 2; // reason and file
      if (formData.visitDetails.reason) filledFields++;
      if (formData.visitDetails.file) filledFields++;
    }

    const progressPercentage = Math.round((filledFields / totalFields) * 100);
    setProgress(progressPercentage);
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const [activeFormTab, setActiveFormTab] = useState(0);

  const handleFormTabClick = (index) => {
    setActiveFormTab(index);
  };

  useEffect(() => {
    const newGuestTabs = Array.from(
      { length: formData.guestMembers },
      (_, i) => `Guest ${i + 1}`
    );
    setGuestTabs(newGuestTabs);

    if (formData.guestMembers < guestTabs.length) {
      setActiveTab(`Guest 1`);
    }
  }, [formData.guestMembers]);

  const [file, setFile] = useState(null);
  const [isfileSelected, setIsfileSelected] = useState(null);
  const [reason, setReason] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    setIsfileSelected(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file.");
      return;
    }
    if (file && file.size > 6 * 1024 * 1024) {
      alert("File size should be less than 6MB");
      return;
    }
    if (!reason) {
      alert("Please provide a reason for re-visit.");
      return;
    }

    console.log("File:", file);
    console.log("Reason:", reason);

    setFile(null);
    setReason("");
  };

  const handleRadioChange = (e) => {
    setVisited(e.target.value);
  };

  const goToPrevStep = () => {
    if (activeFormTab > 0) {
      setActiveFormTab((prev) => prev - 1);
    }
  };

  const goToNextStep = () => {
    if (activeFormTab < tabs.length - 1) {
      setActiveFormTab((prev) => prev + 1);
    }
  };

  return (
    <div className="application-form">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="form-tabs">
        <ul>
          {tabs.map((tab, index) => (
            <li
              key={tab.id}
              className={`tab-item ${activeFormTab === index ? "active" : ""}`}
              onClick={() => handleFormTabClick(index)}
            >
              <span className="tabIndex">{index + 1}</span> {tab.tabName}
            </li>
          ))}
        </ul>
      </div>

      {activeFormTab === 0 && (
        <DormitoryApplicationDetails
          tabName={"Application Details"}
          goToNextStep={goToNextStep}
        />
      )}
      {activeFormTab === 1 && (
        <DormitoryAccommodationDetails
          tabName={"Accommodation details"}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
        />
      )}

      {activeFormTab === 2 && (
        <DormitoryVisitDetails
          tabName={"Visit Details"}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
        />
      )}

      {activeFormTab === 3 && <DormitoryVerifyDetails tabName={"Verify Details"} />}
    </div>
  );
};

export default DormitoryApplicationForm;
