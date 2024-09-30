import React, { useState, useEffect } from "react";
import './ApplicationForm.scss';
import CommonButton from "../../components/ui/Button";
import ApplicationDetails from "./applicationTabs/applicationDetails/ApplicationDetails";
import GuestDetails from "./applicationTabs/GuestDetails/GuestDetails";
import VisitDetails from "./applicationTabs/VisitDetails/VisitDetails";

const ApplicationForm = () => {
    const tabs = [
        {
            id: 1, tabName: 'Application Details'
        },
        {
            id: 2, tabName: 'Guest Details'
        },
        {
            id: 3, tabName: 'Visit Details'
        }, {
            id: 4, tabName: 'Verify Details'
        }
    ]
    const [visited, setVisited] = useState(null); // State to track the radio button selection
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


    const [activeFormTab, setActiveFormTab] = useState(0); // Default active tab is the first tab

    const handleFormTabClick = (index) => {
        setActiveFormTab(index);
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

    const handleRadioChange = (e) => {
        setVisited(e.target.value);
    };

    return (
        <div className="application-form">
            {/* Progress bar */}
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
                <ApplicationDetails />
            )}
            {/* guest details form */}
            {activeFormTab === 1 && (
                <GuestDetails />
            )}



            {/* Visit details form */}

            {
                activeFormTab === 2 && (
                    <VisitDetails />
                )
            }

        </div>
    );
};

export default ApplicationForm;
