import React, { useState } from 'react';
import CommonButton from '../../../../components/ui/Button';

const VisitDetails = () => {
    // State initialization
    const [formData, setFormData] = useState({
        visitDate: '',
        departureDate: '',
        reason: '',
    });
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState(null);
    const [visited, setVisited] = useState('');
    const [isFileSelected, setIsFileSelected] = useState(true);

    // Handle input changes for form fields and clear errors on valid input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear errors when user inputs valid data
        setErrors({
            ...errors,
            [name]: value ? '' : errors[name],
        });
    };

    // Handle radio button changes
    const handleRadioChange = (e) => {
        setVisited(e.target.value);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setIsFileSelected(true);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setIsFileSelected(true);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Validate form fields
    const validateForm = () => {
        let formErrors = {};
        if (!formData.visitDate) {
            formErrors.visitDate = 'Please select an arrival date.';
        }
        if (!formData.departureDate) {
            formErrors.departureDate = 'Please select a departure date.';
        }
        if (!visited) {
            formErrors.visited = 'Please select if you have visited before.';
        }
        if (visited === 'yes' && !formData.reason) {
            formErrors.reason = 'Please provide a reason for re-visit.';
        }
        if (!file) {
            formErrors.file = 'Please upload a recommendation letter.';
        }
        return formErrors;
    };

    // Handle form submission and file upload
    const handleFileUpload = (event) => {
        event.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Valid file upload and reason
        if (file && file.size > 6 * 1024 * 1024) {
            alert("File size should be less than 6MB.");
            return;
        }

        // Form submission logic (send to server)
        console.log('File:', file);
        console.log('Form Data:', formData);

        // Reset the form
        setFile(null);
        setFormData({
            visitDate: '',
            departureDate: '',
            reason: '',
        });
        setVisited('');
    };

    return (
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
                                <div className="upload-icon">&#8593;</div> {/* Replace with an actual icon if needed */}
                                <div className="upload-text">
                                    Drag and drop files here to upload.<br />
                                    <span className="upload-subtext">
                                        {'Only JPEG, PNG, and SVG files are allowed.'}
                                    </span>
                                </div>
                            </label>
                        </div>
                        {errors.file && <span className="error">{errors.file}</span>}
                        <div className="upload-text">
                            {file && (
                                <>
                                    <strong style={{ fontSize: 15, fontWeight: 500, color: '#000000', letterSpacing: 1 }}>Selected file: </strong>
                                    <span style={{ fontSize: 15, fontWeight: 500, color: 'green' }}>{file.name}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-right-section">
                    <div className="form-group" style={{ paddingTop: '10px' }}>
                        <label>Previously Visited?</label>
                        <div style={{ display: 'flex', gap: 40, paddingTop: '10px' }}>
                            <div>
                                <input
                                    name="visited"
                                    type="radio"
                                    value="yes"
                                    onChange={handleRadioChange}
                                />
                                <span>Yes</span>
                            </div>
                            <div>
                                <input
                                    name="visited"
                                    type="radio"
                                    value="no"
                                    onChange={handleRadioChange}
                                />
                                <span>No</span>
                            </div>
                        </div>
                        {errors.visited && <span className="error">{errors.visited}</span>}
                    </div>

                    {visited === 'yes' && (
                        <>
                            <div className="form-group" style={{ paddingTop: '4px' }}>
                                <label htmlFor="visitDate">Previous Arrival Date</label>
                                <input
                                    type="date"
                                    name="visitDate"
                                    value={formData.visitDate}
                                    onChange={handleInputChange}
                                />
                                {errors.visitDate && <span className="error">{errors.visitDate}</span>}
                            </div>

                            <div className="form-group" style={{ paddingTop: '2px' }}>
                                <label htmlFor="reason">State reason for re-visit</label>
                                <textarea
                                    rows={3}
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    placeholder="State reason for re-visit"
                                />
                                {errors.reason && <span className="error">{errors.reason}</span>}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="submit-button" style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 30px' }}>
                <CommonButton
                    buttonName="Back"
                    style={{ backgroundColor: '#FFF', color: '#000', borderColor: '#4B4B4B', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '15px 20px' }}
                />
                <CommonButton
                    buttonName="Proceed"
                    style={{ backgroundColor: '#9867E9', color: '#FFFFFF', borderColor: '#9867E9', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '15px 100px' }}
                    onClick={handleFileUpload}
                />
            </div>
        </div>
    );
};

export default VisitDetails;