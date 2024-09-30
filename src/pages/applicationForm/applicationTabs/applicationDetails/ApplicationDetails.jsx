import React, { useState, useEffect } from "react";
import './ApplicationDetails.scss';
import CommonButton from "../../../../components/ui/Button";
const ApplicationDetails = () => {
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        occupation: '',
        age: '',
        gender: '',
        email: '',
        deeksha: '',
        guestMembers: 1,
        aadhaar: '',
        phoneNumber: '',

        guests: [
            {
                guestName: '',
                guestAadhaar: '',
                guestNumber: '',
                guestAddress: ''
            }
        ],

        visitDate: '',
        departureDate: '',
    });
    const validateForm = () => {

        let formErrors = {};

        if (!formData.name) formErrors.name = "Name is required";
        if (!formData.age || isNaN(formData.age)) formErrors.age = "Valid age is required";
        if (!formData.gender) formErrors.gender = "Gender is required";
        if (!formData.email) formErrors.email = "Email is required";
        if (!formData.occupation) formErrors.occupation = "Occupation is required";
        if (!formData.deeksha) formErrors.deeksha = "Deeksha is required";
        if (!formData.aadhaar) formErrors.aadhaar = "Aadhaar number is required";
        if (!formData.phoneNumber) formErrors.phoneNumber = "Phone number is required";
        if (!formData.visitDate) formErrors.visitDate = "Visit date is required";
        if (!formData.departureDate) formErrors.departureDate = "Departure date is required";
        formData.guests.forEach((guest, index) => {
            if (!guest.guestName) formErrors[`guestName${index}`] = `Guest ${index + 1} Name is required`;
            if (!guest.guestAadhaar) formErrors[`guestAadhaar${index}`] = `Guest ${index + 1} Aadhaar is required`;
            if (!guest.guestNumber) formErrors[`guestNumber${index}`] = `Guest ${index + 1} Phone number is required`;
            if (!guest.guestAddress) formErrors[`guestAddress${index}`] = `Guest ${index + 1} Address is required`;
        });

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file === null || file === undefined) {
            setIsfileSelected(false);
        } else {
            setIsfileSelected(true);
        }

        if (validateForm()) {
            console.log("Form submitted successfully", formData);
        } else {
            console.log("Form has errors", errors);
        }
    };
    return (
        <div className="application-form">

            {/* Application Details form */}
            <form onSubmit={handleSubmit} >
                <div className="div">
                    <h2>Applicant Details</h2>
                    <div className="form-section">

                        <div className="form-left-section">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange} placeholder="John Deo"
                                />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="form-group" style={{ width: '50%' }}>
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange} placeholder="34"
                                    />
                                    {errors.age && <span className="error">{errors.age}</span>}
                                </div>
                                <div className="form-group" style={{ width: '50%' }}>
                                    <label>Gender</label>
                                    <input
                                        type="text"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange} placeholder="M"
                                    />
                                    {errors.gender && <span className="error">{errors.gender}</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email ID</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange} placeholder="Email id"
                                />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Number of Guest members</label>
                                <select
                                    className="form-control"
                                    name="guestMembers"
                                    value={formData.guestMembers}
                                    onChange={handleInputChange}
                                >
                                    {[...Array(6)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                                {errors.memberCount && <span className="error">{errors.memberCount}</span>}
                            </div>
                        </div>
                        <div className="form-right-section">
                            <div className="form-group">
                                <label>Occupation</label>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleInputChange}
                                    placeholder="Enter Your occupation"
                                />
                                {errors.occupation && <span className="error">{errors.occupation}</span>}
                            </div>
                            <div className="form-group">
                                <label>Initiation / Mantra Diksha from </label>

                                <select>
                                    <option value="">Select Deeksha</option>
                                    <option value="">Sri Sarada Devi – Life and Teachings</option>
                                    <option value="">Sri Sarada Devi – Life and Teachings</option>
                                    <option value="">Swami Vivekananda – His Life and Legacy</option>
                                    <option value="">The Gospel of Sri Ramakrishna</option>
                                    <option value="">None</option>
                                </select>
                                {errors.deeksha && <span className="error">{errors.deeksha}</span>}
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label>Aadhaar Number</label>
                                <input
                                    type="text"
                                    name="aadhaar"
                                    value={formData.aadhaar}
                                    onChange={handleInputChange} placeholder=".... .... ...."
                                />
                                {/* <span style={{ color: 'var(--commonColor)', position: 'absolute', top: 47, right: 20 }}>Verify Aadhar</span> */}
                                {errors.aadhaar && <span className="error">{errors.aadhaar}</span>}
                            </div>


                            <div className="form-group" >
                                <label htmlFor="phone">Phone number</label>
                                <div className="phone-input">
                                    <select id="country-code" name="country-code">
                                        <option value="+91">+91</option>

                                    </select>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange} placeholder="6262452164"
                                    />

                                </div>
                                {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                            </div>

                        </div>
                    </div>
                    <div className="address-section">
                        <h3>Address 1</h3>

                        <div className="formTabSection">
                            <div className="addressInputBox">
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your State"
                                    />
                                    {errors.occupation && <span className="error">{errors.occupation}</span>}
                                </div>

                                <div className="form-group">
                                    <label>House Number</label>

                                    <input
                                        type="text"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange} placeholder="Your house number"
                                    />
                                    {errors.gender && <span className="error">{errors.gender}</span>}
                                </div>

                            </div>
                            <div className="addressInputBox">
                                <div className="form-group">
                                    <label>District</label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        placeholder="Enter your district"
                                    />
                                    {errors.occupation && <span className="error">{errors.occupation}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Street Name</label>

                                    <input
                                        type="text"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange} placeholder="Street name"
                                    />
                                    {errors.gender && <span className="error">{errors.gender}</span>}
                                </div>

                            </div>

                            <div className="addressInputBox">
                                <div className="form-group">
                                    <label>Pin Code</label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        placeholder="Enter Pincode"
                                    />
                                    {errors.occupation && <span className="error">{errors.occupation}</span>}
                                </div>



                            </div>


                        </div>

                    </div>

                    <div className="submit-button">
                        <CommonButton
                            buttonName="Add Guest"
                            style={{ backgroundColor: '#9867E9', color: '#FFFFFF', borderColor: '#9867E9', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '15px 100px' }}
                        />
                    </div>
                </div>

            </form >
        </div>
    )
}

export default ApplicationDetails