import React from "react";
import "./ApplicationDetails.scss";
import CommonButton from "../../../../components/ui/Button";
import useApplicationStore from "../../../../../useApplicationStore";

const ApplicationDetails = ({ goToNextStep, tabName }) => {
  const { formData, errors, setFormData, setAddressData, setErrors } =
    useApplicationStore();

  // Handle form input changes for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  // Handle form input changes for address fields
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(name, value);
  };

  // Handle form submission and validate
  const handleSubmit = (e) => {
    e.preventDefault();

    let hasErrors = false;

    // Validate name
    if (!formData.name) {
      setErrors("name", "Name is required");
      hasErrors = true;
    } else {
      setErrors("name", "");
    }

    // Validate email
    if (!formData.email) {
      setErrors("email", "Email is required");
      hasErrors = true;
    } else {
      setErrors("email", "");
    }

    // Proceed if there are no validation errors
    if (!hasErrors) {
      goToNextStep();
    } else {
      console.log("Validation errors occurred");
    }
  };

  return (
    <div className="application-form">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <h2>Applicant Details</h2>
          <div className="form-section">
            <div className="form-left-section">
              {/* Name Field */}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              {/* Age and Gender */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div className="form-group" style={{ width: "50%" }}>
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="34"
                  />
                  {errors.age && <span className="error">{errors.age}</span>}
                </div>
                <div className="form-group" style={{ width: "50%" }}>
                  <label>Gender</label>
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    placeholder="M/F/O"
                  />
                  {errors.gender && (
                    <span className="error">{errors.gender}</span>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@example.com"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              {/* Number of Guest Members */}
              <div className="form-group">
                <label>Number of Guest members</label>
                <select
                  className="form-control"
                  name="guestMembers"
                  value={formData.guestMembers}
                  onChange={handleInputChange}
                >
                  {[...Array(6)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                {errors.guestMembers && (
                  <span className="error">{errors.guestMembers}</span>
                )}
              </div>
            </div>

            <div className="form-right-section">
              {/* Occupation Field */}
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Enter your occupation"
                />
                {errors.occupation && (
                  <span className="error">{errors.occupation}</span>
                )}
              </div>

              <div className="form-group">
                <label>Initiation / Mantra Diksha from</label>
                <select
                  name="deeksha"
                  value={formData.deeksha}
                  onChange={handleInputChange}
                >
                  <option value="">Select Deeksha</option>
                  <option value="Sri Ramakrishna – Life and Teachings">
                    Sri Ramakrishna – Life and Teachings
                  </option>
                  <option value="Sri Sarada Devi – Life and Teachings">
                    Sri Sarada Devi – Life and Teachings
                  </option>
                  <option value="Swami Vivekananda – His Life and Legacy">
                    Swami Vivekananda – His Life and Legacy
                  </option>
                  <option value="The Gospel of Sri Ramakrishna">
                    The Gospel of Sri Ramakrishna
                  </option>
                  <option value="none">None</option>
                </select>
                {errors.deeksha && (
                  <span className="error">{errors.deeksha}</span>
                )}
              </div>

              {/* Aadhaar Number */}
              <div className="form-group" style={{ position: "relative" }}>
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  placeholder=".... .... ...."
                />
                {errors.aadhaar && (
                  <span className="error">{errors.aadhaar}</span>
                )}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone">Phone number</label>
                <div className="phone-input">
                  <select id="country-code" name="country-code">
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="6262452164"
                  />
                </div>
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
            </div>
          </div>

          {/* Address Fields */}
          <div className="address-section">
            <h3>Address 1</h3>
            <div className="formTabSection">
              <div className="addressInputBox">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressInputChange}
                    placeholder="Enter your state"
                  />
                  {errors.state && (
                    <span className="error">{errors.state}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>House Number</label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.address.houseNumber}
                    onChange={handleAddressInputChange}
                    placeholder="Your house number"
                  />
                  {errors.houseNumber && (
                    <span className="error">{errors.houseNumber}</span>
                  )}
                </div>
              </div>

              <div className="addressInputBox">
                <div className="form-group">
                  <label>District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.address.district}
                    onChange={handleAddressInputChange}
                    placeholder="Enter your district"
                  />
                  {errors.district && (
                    <span className="error">{errors.district}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Street Name</label>
                  <input
                    type="text"
                    name="streetName"
                    value={formData.address.streetName}
                    onChange={handleAddressInputChange}
                    placeholder="Street name"
                  />
                  {errors.streetName && (
                    <span className="error">{errors.streetName}</span>
                  )}
                </div>
              </div>

              <div className="addressInputBox">
                <div className="form-group">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.address.pinCode}
                    onChange={handleAddressInputChange}
                    placeholder="Enter Pincode"
                  />
                  {errors.pinCode && (
                    <span className="error">{errors.pinCode}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {tabName && (
          <div className="submit-button">
            <CommonButton
              buttonName="Add Guest"
              style={{
                backgroundColor: "#9867E9",
                color: "#FFFFFF",
                borderColor: "#9867E9",
                fontSize: "18px",
                borderRadius: "7px",
                borderWidth: 1,
                padding: "15px 100px",
              }}
              onClick={handleSubmit}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplicationDetails;
