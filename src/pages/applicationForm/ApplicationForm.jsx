import React, { useState, useEffect } from "react";
import './ApplicationForm.scss';
import CommonButton from "../../components/ui/Button";

const ApplicationForm = () => {
    const [activeTab, setActiveTab] = useState('Guest 1');
    const [guestTabs, setGuestTabs] = useState(['Guest 1']);
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

    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(0); // Track form progress

    // Function to calculate progress
    const calculateProgress = () => {
        const totalFields = 11 + (formData.guestMembers * 4); // Adjust the number according to the fields
        let filledFields = 0;

        // Count the filled main form fields
        Object.keys(formData).forEach(key => {
            if (key !== 'guests' && formData[key] !== '') {
                filledFields++;
            }
        });

        // Count the filled guest form fields
        formData.guests.forEach(guest => {
            Object.keys(guest).forEach(key => {
                if (guest[key] !== '') {
                    filledFields++;
                }
            });
        });

        // Calculate the progress percentage
        const progressPercentage = (filledFields / totalFields) * 100;
        setProgress(progressPercentage);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleGuestInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedGuests = [...formData.guests];
        updatedGuests[index] = {
            ...updatedGuests[index],
            [name]: value
        };
        setFormData(prevState => ({
            ...prevState,
            guests: updatedGuests,
        }));
    };

    useEffect(() => {
        calculateProgress(); // Update the progress when formData changes
    }, [formData]);

    useEffect(() => {
        const newGuestTabs = Array.from({ length: formData.guestMembers }, (_, i) => `Guest ${i + 1}`);
        setGuestTabs(newGuestTabs);

        // Adjust the formData.guests array size based on the number of guest members
        setFormData(prevState => ({
            ...prevState,
            guests: prevState.guests.slice(0, formData.guestMembers).concat(
                Array.from({ length: formData.guestMembers - prevState.guests.length }, () => ({
                    guestName: '',
                    guestAadhaar: '',
                    guestNumber: '',
                    guestAddress: ''
                }))
            )
        }));

        if (formData.guestMembers < guestTabs.length) {
            setActiveTab(`Guest 1`);
        }
    }, [formData.guestMembers]);

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

    useEffect(() => {
        const newGuestTabs = Array.from({ length: formData.guestMembers }, (_, i) => `Guest ${i + 1}`);
        setGuestTabs(newGuestTabs);

        // Adjust the formData.guests array size based on the number of guest members
        setFormData(prevState => ({
            ...prevState,
            guests: prevState.guests.slice(0, formData.guestMembers).concat(
                Array.from({ length: formData.guestMembers - prevState.guests.length }, () => ({
                    guestName: '',
                    guestAadhaar: '',
                    guestNumber: '',
                    guestAddress: ''
                }))
            )
        }));

        if (formData.guestMembers < guestTabs.length) {
            setActiveTab(`Guest 1`);
        }
    }, [formData.guestMembers]);

    const [file, setFile] = useState(null); // state to manage select file
    const [isfileSelected, setIsfileSelected] = useState(null); // to check validation
    const [reason, setReason] = useState(''); // to set reason for file upload

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

    // handle to upload file on server
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

        // Here you can handle the file upload and reason, e.g., by sending it to a server.
        console.log('File:', file);
        console.log('Reason:', reason);

        // Reset the form
        setFile(null);
        setReason('');
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
            {/* Progress bar */}
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <form onSubmit={handleSubmit} className="application-form-section">
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
                            <label>Deeksha</label>
                            {/* <input
                                type="text"
                                name="deeksha" placeholder="Deeksha"
                                value={formData.deeksha}
                                onChange={handleInputChange}
                            /> */}
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

                {/* guest details form */}
                <div className="guest-details">
                    <h2>Guest Details</h2>
                    <div className="form-tabs custom-form-tab">
                        {guestTabs.map(tab => (
                            <div
                                key={tab}
                                className={`tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>

                    {guestTabs.map((tab, index) => (
                        activeTab === tab && (
                            <div key={tab} className="tab-content">
                                <div className="form-left-section">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="guestName"
                                            value={formData.guests[index].guestName}
                                            onChange={(e) => handleGuestInputChange(e, index)}
                                            placeholder="John Deep"
                                        />
                                        {errors[`guestName${index}`] && <span className="error">{errors[`guestName${index}`]}</span>}
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
                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label>Aadhaar Number</label>
                                        <input
                                            type="password"
                                            name="guestAadhaar"
                                            value={formData.guests[index].guestAadhaar}
                                            onChange={(e) => handleGuestInputChange(e, index)}
                                            placeholder=".... .... ...."
                                        />
                                        {/* <span style={{ color: 'var(--commonColor)', position: 'absolute', top: 47, right: 20 }}>Verify Aadhar</span> */}
                                        {errors[`guestAadhaar${index}`] && <span className="error">{errors[`guestAadhaar${index}`]}</span>}
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
                                            placeholder="6264452164"
                                        />
                                        {errors[`guestNumber${index}`] && <span className="error">{errors[`guestNumber${index}`]}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Deeksha</label>
                                       
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
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            name="guestAddress"
                                            value={formData.guests[index].guestAddress}
                                            onChange={(e) => handleGuestInputChange(e, index)}
                                            placeholder="123 Street, City"
                                        />
                                        {errors[`guestAddress${index}`] && <span className="error">{errors[`guestAddress${index}`]}</span>}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* guest details form */}
                <div className="guest-details">
                    <h2>Visit Details</h2>

                    <div className="VisitDetails">
                        <div className="form-left-section">
                            <div className="form-group">
                                <label>Arrival Date</label>
                                <input
                                    type="date"
                                    name="visitDate"
                                    value={formData.visitDate}
                                    onChange={handleInputChange}
                                />
                                {errors.visitDate && <span className="error">{errors.visitDate}</span>}
                            </div>

                            <div className="form-group">
                                <label>Departure Date</label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleInputChange}
                                />
                                {errors.departureDate && <span className="error">{errors.departureDate}</span>}
                            </div>
                        </div>

                        <div className="form-right-section">

                            <div className="form-group file-upload-section">
                                <label>Recommendation Letter</label>
                                <div
                                    className="upload-container"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".jpeg, .png, .svg"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="file-upload" className="upload-label">
                                        <div className="upload-icon">&#8593;</div> {/* You can replace this with an actual icon */}
                                        <div className="upload-text">
                                            Drag and drop files here to upload.<br />
                                            <span className="upload-subtext">
                                                {'Only JPEG, PNG and SVG files are allowed.'}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                {isfileSelected === false && (
                                    <span className="error">Please upload you ID</span>
                                )}
                                <div className="upload-text">
                                    {file && (
                                        <>
                                            <strong style={{ fontSize: 15, fontWeight: 500, color: '#000000', letterSpacing: 1 }}>Selected file: </strong>
                                            <span style={{ fontSize: 15, fontWeight: 500, color: 'green' }}>{file.name}</span>
                                        </>
                                    )}
                                </div>
                                <p style={{ marginTop: 30 }}>Visited less than 6 months ago, state reason for re-visit</p>


                            </div>
                            <div className="submit-button">
                                <CommonButton
                                    buttonName="Submit"
                                    style={{ backgroundColor: '#9867E9', color: '#FFFFFF', borderColor: '#9867E9', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '15px 100px' }}
                                />
                            </div>

                            {/* <div className="form-group">
                                <label htmlFor="reason">Reason for Re-visit</label>
                                <input
                                    id="reason"
                                    type="text"
                                    value={reason}
                                    onChange={handleReasonChange}
                                    placeholder="State reason for re-visit"
                                />

                            </div> */}
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;
