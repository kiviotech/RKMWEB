import React, { useState } from "react";
import './ApplicationForm.scss';

const ApplicationForm = () => {
    const [activeTab, setActiveTab] = useState('Guest 1');
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
        arrivalDate: '',
        departureDate: '',
        recommendationLetter: null,
    });

    const [errors, setErrors] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.name) formErrors.name = "Name is required";
        if (!formData.age || isNaN(formData.age)) formErrors.age = "Valid age is required";
        if (!formData.gender) formErrors.gender = "Gender is required";
        if (!formData.email) formErrors.email = "Email is required";
        if (!formData.memberCount) formErrors.memberCount = "Member Count is required";

        if (!formData.occupation) formErrors.occupation = "Occupation is required";
        if (!formData.deeksha) formErrors.deeksha = "deeksha is required";
        if (!formData.aadhaar) formErrors.aadhaar = "Aadhaar number is required";
        if (!formData.phoneNumber) formErrors.phoneNumber = "Phone number is required";


        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Submit form data
            console.log("Form submitted successfully", formData);
        } else {
            console.log("Form has errors", errors);
        }
    };


    return (
        <div className="application-form">
            <form onSubmit={handleSubmit}>
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
                            <select className="form-control" value={formData.memberCount}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3" defaultValue>3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
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
                            <label>Deeksha</label>
                            <input
                                type="text"
                                name="occupation" placeholder="Deeksha"
                                value={formData.deeksha}
                                onChange={handleInputChange}
                            />
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
                            <span style={{ color: 'var(--commonColor)', position: 'absolute', top: 47, right: 20 }}>Verify Aadhar</span>
                            {errors.aadhaar && <span className="error">{errors.aadhaar}</span>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange} placeholder="+91-6262452164"
                            />
                            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                        </div>
                    </div>

                </div>

                {/* Guest Details and Visit Details sections */}

                <div className="guest-details">
                    <h2>Guest Details</h2>
                    <div className="form-tabs">
                        <div
                            className={`tab ${activeTab === 'Guest 1' ? 'active' : ''}`}
                            onClick={() => handleTabClick('Guest 1')}
                        >
                            Guest  1
                        </div>
                        <div
                            className={`tab ${activeTab === 'Guest 2' ? 'active' : ''}`}
                            onClick={() => handleTabClick('Guest 2')}
                        >
                            Guest  2
                        </div>
                        <div
                            className={`tab ${activeTab === 'Guest 3' ? 'active' : ''}`}
                            onClick={() => handleTabClick('Guest 3')}
                        >
                            Guest  3
                        </div>
                    </div>
                </div>

                {/* <button type="submit" className="submit-button">Submit</button> */}
            </form>
        </div>

    );

}

export default ApplicationForm