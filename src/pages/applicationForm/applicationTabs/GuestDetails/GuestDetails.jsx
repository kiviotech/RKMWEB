import React, { useState, useEffect } from "react";
import CommonButton from "../../../../components/ui/Button";
import useApplicationStore from "../../../../../useApplicationStore";

const GuestDetails = ({ goToNextStep, goToPrevStep, tabName }) => {
  const { formData, errors, setErrors, setGuestData, updateGuestMembers } =
    useApplicationStore();
  const validRelations = [
    "mother",
    "father",
    "son",
    "daughter",
    "wife",
    "aunt",
    "friend",
    "other",
  ];

  const [activeTab, setActiveTab] = useState("Guest 1");

  // Create guest tabs based on the number of guests
  const guestTabs = formData.guests.map((_, index) => `Guest ${index + 1}`);

  // Handle guest input changes
  const handleGuestInputChange = (e, index) => {
    const { name, value } = e.target;
    setGuestData(index, name, value);
  };

  useEffect(() => {
    // Ensure the number of guests matches the guestMembers count
    updateGuestMembers(formData.guestMembers);
  }, [formData.guestMembers, updateGuestMembers]);

  const handleBack = () => {
    goToPrevStep();
  };

  const handleProceed = (e) => {
    e.preventDefault();

    let hasErrors = false;
    formData.guests.forEach((guest, index) => {
      // Validate guest name
      if (!guest.guestName) {
        setErrors(`guestName${index}`, "Name is required");
        hasErrors = true;
      } else {
        setErrors(`guestName${index}`, "");
      }

      // Validate phone number (must be 10 digits)
      if (!guest.guestNumber) {
        setErrors(`guestNumber${index}`, "Phone number is required");
        hasErrors = true;
      } else if (!/^\d{10}$/.test(guest.guestNumber)) {
        setErrors(`guestNumber${index}`, "Phone number must be 10 digits long");
        hasErrors = true;
      } else {
        setErrors(`guestNumber${index}`, "");
      }

      // Validate Aadhaar (must be 12 digits)
      if (!guest.guestAadhaar) {
        setErrors(`guestAadhaar${index}`, "Aadhaar is required");
        hasErrors = true;
      } else if (!/^\d{12}$/.test(guest.guestAadhaar)) {
        setErrors(
          `guestAadhaar${index}`,
          "Aadhaar number must be 12 digits long"
        );
        hasErrors = true;
      } else {
        setErrors(`guestAadhaar${index}`, "");
      }

      // Validate occupation
      if (!guest.guestOccupation) {
        setErrors(`guestOccupation${index}`, "Occupation is required");
        hasErrors = true;
      } else {
        setErrors(`guestOccupation${index}`, "");
      }

      if (!guest.guestRelation) {
        setErrors(
          `guestRelation${index}`,
          "Relation with applicant is required"
        );
        hasErrors = true;
      } else if (!validRelations.includes(guest.guestRelation.toLowerCase())) {
        setErrors(
          `guestRelation${index}`,
          "Invalid relation. Must be one of: mother, father, son, daughter, wife, aunt, friend, or other."
        );
        hasErrors = true;
      } else {
        setErrors(`guestRelation${index}`, "");
      }

      // Validate Address 1 fields
      const address1 = guest.guestAddress1;
      if (!address1.state) {
        setErrors(`guestAddress1State${index}`, "State is required");
        hasErrors = true;
      } else {
        setErrors(`guestAddress1State${index}`, "");
      }

      if (!address1.district) {
        setErrors(`guestAddress1District${index}`, "District is required");
        hasErrors = true;
      } else {
        setErrors(`guestAddress1District${index}`, "");
      }

      if (!address1.streetName) {
        setErrors(`guestAddress1StreetName${index}`, "Street Name is required");
        hasErrors = true;
      } else {
        setErrors(`guestAddress1StreetName${index}`, "");
      }

      if (!address1.pinCode) {
        setErrors(`guestAddress1PinCode${index}`, "Pin Code is required");
        hasErrors = true;
      } else if (!/^\d{6}$/.test(address1.pinCode)) {
        setErrors(
          `guestAddress1PinCode${index}`,
          "Pin Code must be 6 digits long"
        );
        hasErrors = true;
      } else {
        setErrors(`guestAddress1PinCode${index}`, "");
      }
    });

    if (!hasErrors) {
      goToNextStep();
    } else {
      console.log("Validation errors occurred");
    }
  };

  return (
    <div className="guest-details">
      <h2>Guest Details</h2>

      {/* Tabs for each guest */}
      <div className="form-tabs custom-form-tab">
        {guestTabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Render guest form based on the active tab */}
      {guestTabs.map(
        (tab, index) =>
          activeTab === tab && (
            <div key={tab} className="tab-content">
              <div
                style={{ display: "flex", flexDirection: "row", gap: "30px" }}
              >
                <div className="form-left-section">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guests[index].guestName}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="Guest Name"
                    />
                    {errors[`guestName${index}`] && (
                      <span className="error">
                        {errors[`guestName${index}`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      name="guestAadhaar"
                      value={formData.guests[index].guestAadhaar}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="Aadhaar Number"
                    />
                    {errors[`guestAadhaar${index}`] && (
                      <span className="error">
                        {errors[`guestAadhaar${index}`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Relation with Applicant</label>
                    <input
                      type="text"
                      name="guestRelation"
                      value={formData.guests[index].guestRelation}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="Relation"
                    />
                    {errors[`guestRelation${index}`] && (
                      <span className="error">
                        {errors[`guestRelation${index}`]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-right-section">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="number"
                      name="guestNumber"
                      value={formData.guests[index].guestNumber}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="Phone Number"
                    />
                    {errors[`guestNumber${index}`] && (
                      <span className="error">
                        {errors[`guestNumber${index}`]}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Occupation</label>
                    <input
                      type="text"
                      name="guestOccupation"
                      value={formData.guests[index].guestOccupation}
                      onChange={(e) => handleGuestInputChange(e, index)}
                      placeholder="Occupation"
                    />
                    {errors[`guestOccupation${index}`] && (
                      <span className="error">
                        {errors[`guestOccupation${index}`]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address 1 Section */}
              <div className="address-section">
                <h3>Address 1</h3>
                <div className="formTabSection">
                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="guestAddress1.state"
                        value={formData.guests[index].guestAddress1.state}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="State"
                      />
                      {errors[`guestAddress1State${index}`] && (
                        <span className="error">
                          {errors[`guestAddress1State${index}`]}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>House Number</label>
                      <input
                        type="text"
                        name="guestAddress1.houseNumber"
                        value={formData.guests[index].guestAddress1.houseNumber}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="House Number"
                      />
                      {errors[`guestAddress1HouseNumber${index}`] && (
                        <span className="error">
                          {errors[`guestAddress1HouseNumber${index}`]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>District</label>
                      <input
                        type="text"
                        name="guestAddress1.district"
                        value={formData.guests[index].guestAddress1.district}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="District"
                      />
                      {errors[`guestAddress1District${index}`] && (
                        <span className="error">
                          {errors[`guestAddress1District${index}`]}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Street Name</label>
                      <input
                        type="text"
                        name="guestAddress1.streetName"
                        value={formData.guests[index].guestAddress1.streetName}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Street Name"
                      />
                      {errors[`guestAddress1StreetName${index}`] && (
                        <span className="error">
                          {errors[`guestAddress1StreetName${index}`]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>Pin Code</label>
                      <input
                        type="text"
                        name="guestAddress1.pinCode"
                        value={formData.guests[index].guestAddress1.pinCode}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Pin Code"
                      />
                      {errors[`guestAddress1PinCode${index}`] && (
                        <span className="error">
                          {errors[`guestAddress1PinCode${index}`]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address 2 Section */}
              <div className="address-section">
                <h3>Address 2</h3>
                <div className="formTabSection">
                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="guestAddress2.state"
                        value={formData.guests[index].guestAddress2.state}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="State"
                      />
                      {errors[`guestAddress2State${index}`] && (
                        <span className="error">
                          {errors[`guestAddress2State${index}`]}
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>House Number</label>
                      <input
                        type="text"
                        name="guestAddress2.houseNumber"
                        value={formData.guests[index].guestAddress2.houseNumber}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="House Number"
                      />
                      {errors[`guestAddress2HouseNumber${index}`] && (
                        <span className="error">
                          {errors[`guestAddress2HouseNumber${index}`]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>District</label>
                      <input
                        type="text"
                        name="guestAddress2.district"
                        value={formData.guests[index].guestAddress2.district}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="District"
                      />
                      {errors[`guestAddress2District${index}`] && (
                        <span className="error">
                          {errors[`guestAddress2District${index}`]}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Street Name</label>
                      <input
                        type="text"
                        name="guestAddress2.streetName"
                        value={formData.guests[index].guestAddress2.streetName}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Street Name"
                      />
                      {errors[`guestAddress2StreetName${index}`] && (
                        <span className="error">
                          {errors[`guestAddress2StreetName${index}`]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="addressInputBox">
                    <div className="form-group">
                      <label>Pin Code</label>
                      <input
                        type="text"
                        name="guestAddress2.pinCode"
                        value={formData.guests[index].guestAddress2.pinCode}
                        onChange={(e) => handleGuestInputChange(e, index)}
                        placeholder="Pin Code"
                      />
                      {errors[`guestAddress2PinCode${index}`] && (
                        <span className="error">
                          {errors[`guestAddress2PinCode${index}`]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
      )}

      {tabName && (
        <div
          className="submit-button"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px 30px",
          }}
        >
          <CommonButton
            buttonName="Back"
            style={{
              backgroundColor: "#FFF",
              color: "#000",
              borderColor: "#4B4B4B",
              fontSize: "18px",
              borderRadius: "7px",
              padding: "15px 20px",
            }}
            onClick={handleBack}
          />
          <CommonButton
            buttonName="Proceed"
            style={{
              backgroundColor: "#9867E9",
              color: "#FFFFFF",
              borderColor: "#9867E9",
              fontSize: "18px",
              borderRadius: "7px",
              padding: "15px 100px",
            }}
            onClick={handleProceed}
          />
        </div>
      )}
    </div>
  );
};

export default GuestDetails;
