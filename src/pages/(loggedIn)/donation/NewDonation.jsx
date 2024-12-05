import React, { useState, useEffect, useRef } from "react";
import "./NewDonation.scss";
import { useAuthStore } from "../../../../store/authStore";
import { useDonationStore } from "../../../../donationStore";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import { createNewDonation, fetchDonationsByField, updateDonationById } from "../../../../services/src/services/donationsService";
import { useNavigate } from 'react-router-dom';

const NewDonation = () => {
  const [selectedTab, setSelectedTab] = useState("Math");
  const [receiptNumber, setReceiptNumber] = useState("");
  const { user } = useAuthStore();
  const { donations, addDonation, updateDonationDetails } = useDonationStore();
  const [donorTags, setDonorTags] = useState([{
    id: Date.now(),
    name: "New Donor",
    isNewDonor: true
  }]);
  const [selectedDonor, setSelectedDonor] = useState(Date.now());
  const [guestDetails, setGuestDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
    title: 'Sri',
    name: '',
    phoneCode: '+91',
    phone: '',
    email: '',
    mantraDiksha: '',
    identityType: '',
    identityNumber: '',
    roomNumber: '',
    pincode: '',
    houseNumber: '',
    streetName: '',
    district: '',
    state: ''
  });
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [donorTabs, setDonorTabs] = useState({});
  const [donationHistory, setDonationHistory] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    phone: '',
    email: '',
    identityNumber: ''
  });
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const [countryCodes, setCountryCodes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  console.log("Zustand Store Data:", {
    // auth: { user },
    donations
  });

  React.useEffect(() => {
    const loadGuestDetails = async () => {
      try {
        const details = await fetchGuestDetails();
        console.log("Fetched Guest Details:", details);
        setGuestDetails(details);
      } catch (error) {
        console.error("Error loading guest details:", error);
      }
    };

    loadGuestDetails();
  }, []);

  const generateReceiptNumber = (tab) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = tab === 'Math' ? 'C' : 'MT';
    return `${prefix}${randomNum}`;
  };

  React.useEffect(() => {
    if (!donations?.receipts || !selectedDonor) {
      setReceiptNumber('');
      setCurrentReceipt(null);
      return;
    }

    // Check if the selected donor is a verified guest
    const selectedDonorTag = donorTags.find(tag => tag.id === selectedDonor);
    if (!selectedDonorTag?.isVerifiedGuest) {
      setReceiptNumber('');
      setCurrentReceipt(null);
      return;
    }

    // Check if donor name exists
    if (!donorDetails.name?.trim()) {
      setReceiptNumber('');
      setCurrentReceipt(null);
      return;
    }

    // Rest of the receipt generation logic
    const currentDonorGroup = donations.receipts.find(group => 
      Array.isArray(group) && 
      group.length > 0 && 
      group.some(r => r.donorDetails?.guestId === donorDetails?.guestId || 
                     (r.donorId === selectedDonor))
    ) || [];

    const existingReceipt = Array.isArray(currentDonorGroup) 
      ? currentDonorGroup.find(r => r.type === selectedTab)
      : null;

    if (!existingReceipt && user && selectedDonor) {
      const generatedNumber = generateReceiptNumber(selectedTab);
      setReceiptNumber(generatedNumber);

      const receiptData = {
        receiptNumber: generatedNumber,
        date: new Date().toLocaleDateString(),
        createdBy: user?.username || 'N/A',
        type: selectedTab,
        status: 'pending',
        amount: 0,
        donorId: selectedDonor,
        donorDetails: donorDetails
      };

      addDonation(receiptData);
      setCurrentReceipt(receiptData);
    } else if (existingReceipt) {
      setReceiptNumber(existingReceipt.receiptNumber);
      setCurrentReceipt(existingReceipt);
      if (existingReceipt.donorDetails) {
        setDonorDetails(existingReceipt.donorDetails);
      }
    }
  }, [selectedTab, user, donorDetails, selectedDonor, donations.receipts, donorTags]);

  // When donor details are updated, update both receipts
  const handleDonorDetailsUpdate = (details) => {
    // Update both Math and Mission receipts with the same donor details
    if (currentReceipt?.receiptNumber) {
      updateDonationDetails(currentReceipt.receiptNumber, { donorDetails: details });
    }
    setDonorDetails(details);
    
    // If there are receipts for this donor, update all of them
    const donorReceipts = donations.receipts.find(group => 
      Array.isArray(group) && 
      group.length > 0 && 
      (group[0].donorId === selectedDonor || group[0].donorDetails?.guestId === selectedDonor)
    ) || [];
    
    donorReceipts.forEach(receipt => {
      if (receipt.receiptNumber !== currentReceipt?.receiptNumber) {
        updateDonationDetails(receipt.receiptNumber, { donorDetails: details });
      }
    });
  };

  const handleAddDonation = () => {
    if (searchTerm) {
      setShowDropdown(true);
    } else {
      const newDonor = {
        id: Date.now(),
        name: "New Donor",
        isNewDonor: true
      };
      setDonorTags(prev => [...prev, newDonor]);
      setSelectedDonor(newDonor.id);
      // Reset donor details
      setDonorDetails({
        title: 'Sri',
        name: '',
        phoneCode: '+91',
        phone: '',
        email: '',
        mantraDiksha: '',
        identityType: '',
        identityNumber: '',
        roomNumber: '',
        pincode: '',
        houseNumber: '',
        streetName: '',
        district: '',
        state: ''
      });
    }
  };

  const handleRemoveTag = (idToRemove) => {
    setDonorTags(donorTags.filter(tag => tag.id !== idToRemove));
    setSelectedDonor(null);
    // Clear the form when removing the tag
    setDonorDetails({
      title: 'Sri',
      name: '',
      phoneCode: '+91',
      phone: '',
      email: '',
      mantraDiksha: '',
      identityType: '',
      identityNumber: '',
      roomNumber: '',
      pincode: '',
      houseNumber: '',
      streetName: '',
      district: '',
      state: ''
    });
  };

  const handleTagClick = (id) => {
    setSelectedDonor(id);
    // Set tab to donor's last selected tab or default to 'Math'
    setSelectedTab(donorTabs[id] || 'Math');
    
    // Find the donor's receipts
    const donorReceipts = donations.receipts.find(group => 
      Array.isArray(group) && 
      group.length > 0 && 
      (group[0].donorId === id || group[0].donorDetails?.guestId === id)
    ) || [];

    // Get the first receipt to access donor details
    const firstReceipt = donorReceipts[0];
    
    if (firstReceipt?.donorDetails) {
      setDonorDetails(firstReceipt.donorDetails);
    } else if (id === donorTags.find(tag => tag.isNewDonor)?.id) {
      // Reset form for new donor
      setDonorDetails({
        title: 'Sri',
        name: '',
        phoneCode: '+91',
        phone: '',
        email: '',
        mantraDiksha: '',
        identityType: '',
        identityNumber: '',
        roomNumber: '',
        pincode: '',
        houseNumber: '',
        streetName: '',
        district: '',
        state: ''
      });
    }
  };

  // Filter guests based on search term
  const filteredGuests = guestDetails?.data?.filter(guest => {
    const searchLower = searchTerm.toLowerCase();
    const name = guest.attributes.name?.toLowerCase() || '';
    const phone = guest.attributes.phone_number || '';
    return name.includes(searchLower) || phone.includes(searchTerm);
  }) || [];

  // Handle guest selection
  const handleGuestSelect = (guest) => {
    const guestData = guest.attributes;
    
    // Parse name to extract title and actual name
    let title = 'Sri';
    let name = guestData.name || '';
    
    const titles = ['Sri', 'Smt', 'Mr', 'Mrs', 'Swami', 'Dr', 'Prof', 'Kumari', 'Ms'];
    
    for (const possibleTitle of titles) {
      if (name.startsWith(possibleTitle + ' ')) {
        title = possibleTitle;
        name = name.substring(possibleTitle.length).trim();
        break;
      }
    }
    
    const addressParts = guestData.address?.split(',').map(part => part.trim()) || [];
    
    const donorDetailsData = {
      title: title,
      name: name,
      phoneCode: '+91',
      phone: guestData.phone_number?.replace('+91', '') || '',
      email: guestData.email || '',
      mantraDiksha: guestData.deeksha || '',
      identityType: 'Aadhaar',
      identityNumber: guestData.aadhaar_number || '',
      roomNumber: guestData.room_allocation?.data?.attributes?.room_number || '',
      pincode: addressParts[4] || '',
      houseNumber: addressParts[0] || '',
      streetName: addressParts[1] || '',
      district: addressParts[2] || '',
      state: addressParts[3] || '',
      guestId: guest.id
    };

    // Update donor tags
    const newDonor = {
      id: guest.id,
      name: guestData.name,
      isNewDonor: false,
      isVerifiedGuest: true  // Add this flag to indicate a verified guest
    };
    
    // Replace the selected donor tag with the new one
    setDonorTags(prev => prev.map(tag => 
      tag.id === selectedDonor ? newDonor : tag
    ));
    
    setSelectedDonor(guest.id);
    handleDonorDetailsUpdate(donorDetailsData);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleTabClick = (tabType) => {
    setSelectedTab(tabType);
    setDonorTabs(prev => ({
      ...prev,
      [selectedDonor]: tabType
    }));
  };

  // Add handler for donation details updates
  const handleDonationDetailsUpdate = (details) => {
    if (currentReceipt?.receiptNumber) {
      updateDonationDetails(currentReceipt.receiptNumber, details);
    }
  };

  const resetFormData = () => {
    // Reset donor details
    setDonorDetails({
      title: 'Sri',
      name: '',
      phoneCode: '+91',
      phone: '',
      email: '',
      mantraDiksha: '',
      identityType: '',
      identityNumber: '',
      roomNumber: '',
      pincode: '',
      houseNumber: '',
      streetName: '',
      district: '',
      state: ''
    });

    // Reset receipt and current receipt
    setReceiptNumber('');
    setCurrentReceipt(null);

    // Reset donor tags and selected donor
    setDonorTags([{
      id: Date.now(),
      name: "New Donor",
      isNewDonor: true
    }]);
    setSelectedDonor(Date.now());

    // Reset donation details in the store
    handleDonationDetailsUpdate({
      amount: '',
      transactionType: '',
      inMemoryOf: '',
      transactionDetails: {
        ddNumber: '',
        ddDate: '',
        bankName: ''
      }
    });
  };

  const handlePrintReceipt = async (status = "completed") => {
    // Check form validity and set validation errors
    const nameError = validateName(donorDetails.name);
    const phoneError = validatePhone(donorDetails.phone);
    const emailError = validateEmail(donorDetails.email);

    setValidationErrors({
      name: nameError,
      phone: phoneError,
      email: emailError
    });

    if (nameError || phoneError || emailError) {
      alert("Please fill required fields");
      return;
    }

    try {
      // First create receipt details
      const receiptPayload = {
        Receipt_number: receiptNumber,
        donation_date: new Date().toISOString().split('T')[0],
        createdby: user?.id || 2
      };

      const receiptResponse = await createNewReceiptDetail(receiptPayload);
      
      if (receiptResponse?.data?.id) {
        const receiptId = receiptResponse.data.id;
        console.log('Receipt Details ID:', receiptId);

        // Get the correct transaction type based on current receipt
        let transactionType = "Cash";
        switch(currentReceipt?.donationDetails?.transactionType?.toLowerCase()) {
          case 'cheque':
            transactionType = "Cheque";
            break;
          case 'bank transfer':
            transactionType = "Bank Transfer";
            break;
          case 'dd':
            transactionType = "DD";
            break;
          case 'm.o':
            transactionType = "M.O";
            break;
          case 'kind':
            transactionType = "Kind";
            break;
          case 'electronic modes':
            transactionType = "Electronic Modes";
            break;
          default:
            transactionType = "Cash";
        }

        // Then create donation with the receipt ID
        const donationPayload = {
          data: {
            guest: donorDetails.guestId || null,
            InMemoryOf: "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount || "0",
            transactionType: transactionType,
            donationFor: selectedTab,
            receipt_detail: receiptId,
            status: status
          }
        };

        // Add transaction details if not cash
        if (transactionType !== 'Cash') {
          donationPayload.data = {
            ...donationPayload.data,
            ddch_number: currentReceipt?.donationDetails?.transactionDetails?.ddNumber || "",
            ddch_date: currentReceipt?.donationDetails?.transactionDetails?.ddDate || "",
            bankName: currentReceipt?.donationDetails?.transactionDetails?.bankName || ""
          };
        }

        const donationResponse = await createNewDonation(donationPayload);
        console.log('Donation created successfully:', donationResponse);
        
        // Reset form after successful submission
        resetFormData();
        
      } else {
        throw new Error('Invalid receipt response format');
      }
      
    } catch (error) {
      console.error('Error in donation process:', error);
      alert('Error processing donation. Please try again.');
    }
  };

  const handlePending = async () => {
    // Check form validity and set validation errors
    const nameError = validateName(donorDetails.name);
    const phoneError = validatePhone(donorDetails.phone);
    const emailError = validateEmail(donorDetails.email);

    setValidationErrors({
      name: nameError,
      phone: phoneError,
      email: emailError
    });

    if (nameError || phoneError || emailError) {
      alert("Please fill required fields");
      return;
    }

    await handlePrintReceipt("pending");
    resetFormData();
  };

  const handleCancel = async () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    // Check form validity and set validation errors
    const nameError = validateName(donorDetails.name);
    const phoneError = validatePhone(donorDetails.phone);
    const emailError = validateEmail(donorDetails.email);

    setValidationErrors({
      name: nameError,
      phone: phoneError,
      email: emailError
    });

    if (nameError || phoneError || emailError) {
      alert("Please fill required fields");
      return;
    }

    await handlePrintReceipt("cancelled");
    resetFormData();
    setShowCancelConfirm(false);
    navigate('/donation');
  };

  // Add this function to calculate total donations
  const calculateTotalDonations = () => {
    if (!donations?.receipts || !selectedDonor) return 0;

    const donorReceipts = donations.receipts.find(group => 
      Array.isArray(group) && 
      group.length > 0 && 
      (group[0].donorId === selectedDonor || group[0].donorDetails?.guestId === selectedDonor)
    ) || [];

    return donorReceipts.reduce((total, receipt) => {
      const amount = parseFloat(receipt.donationDetails?.amount || 0);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const handleReset = () => {
    if (!selectedDonor || !currentReceipt) return;

    // Find the donor's receipts group
    const donorReceiptsIndex = donations.receipts.findIndex(group => 
      Array.isArray(group) && 
      group.length > 0 && 
      (group[0].donorId === selectedDonor || group[0].donorDetails?.guestId === selectedDonor)
    );

    if (donorReceiptsIndex === -1) return;

    // Create new receipts array without the current tab's receipt
    const updatedReceipts = donations.receipts.map((group, index) => {
      if (index === donorReceiptsIndex) {
        return group.filter(receipt => receipt.type !== selectedTab);
      }
      return group;
    });

    // Update the store with new receipts
    donations.receipts = updatedReceipts;

    // Reset current receipt and receipt number
    setCurrentReceipt(null);
    setReceiptNumber('');

    // Reset donation details in the form
    handleDonationDetailsUpdate({
      amount: '',
      transactionType: '',
      inMemoryOf: '',
      transactionDetails: {
        ddNumber: '',
        ddDate: '',
        bankName: ''
      }
    });
  };

  // Add this useEffect to fetch donation history when donor changes
  React.useEffect(() => {
    const fetchDonorHistory = async () => {
      if (!donorDetails.guestId) return;
      
      try {
        const response = await fetchDonationsByField('guest', donorDetails.guestId);
        setDonationHistory(response.data || []);
      } catch (error) {
        console.error('Error fetching donation history:', error);
      }
    };

    fetchDonorHistory();
  }, [donorDetails.guestId]);

  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return 'Name should only contain letters and spaces';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return 'Phone number must be 10 digits';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required'; // Changed to make email required
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Add these validation functions near your other validation functions
  const validateIdentityNumber = (type, number) => {
    if (!number) return '';
    
    switch (type) {
      case 'Aadhaar':
        if (!/^\d{12}$/.test(number)) {
          return 'Aadhaar number must be 12 digits';
        }
        break;
      case 'PAN':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number)) {
          return 'PAN must be in format: ABCDE1234F';
        }
        break;
      case 'Passport':
        if (!/^[A-Z]{1}[0-9]{7}$/.test(number)) {
          return 'Passport must be in format: A1234567';
        }
        break;
    }
    return '';
  };

  // Add this function to check if form is valid
  const isFormValid = () => {
    // Check required fields
    if (!donorDetails.name || !donorDetails.phone) {
      return false;
    }

    // Check validation errors
    if (validationErrors.name || validationErrors.phone || validationErrors.email) {
      return false;
    }

    return true;
  };

  // Add this function to fetch pincode details
  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6) return;
    
    setIsLoadingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setDonorDetails(prev => ({
          ...prev,
          district: postOffice.District,
          state: postOffice.State
        }));
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
    } finally {
      setIsLoadingPincode(false);
    }
  };

  // Add this useEffect after other useEffects
  useEffect(() => {
    // Fetch country codes list
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const codes = data
          .filter((country) => country.idd.root)
          .map((country) => ({
            code: (
              country.idd.root + (country.idd.suffixes?.[0] || "")
            ).replace(/[^0-9]/g, ""),
            flagUrl: country.flags.svg,
            id: country.cca2,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      })
      .catch((error) => {
        console.error("Error fetching country codes:", error);
      });
  }, []);

  // Add this useEffect for handling clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="donations-container">
      <div className="donor-tags">
        {donorTags.map(tag => (
          <div 
            key={tag.id} 
            className={`tag ${selectedDonor === tag.id ? 'selected' : ''}`}
            onClick={() => handleTagClick(tag.id)}
          >
            {tag.name} 
            <span className="close" onClick={(e) => {
              e.stopPropagation();
              handleRemoveTag(tag.id);
            }}>×</span>
          </div>
        ))}
        <button className="add-donation-btn" onClick={handleAddDonation}>
          + Add Donation
        </button>
      </div>

      <div className="header">
        <h1>New Donation</h1>
        <div className="search-section">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by Name or phone number"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && searchTerm && (
              <div className="search-dropdown">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <div 
                      key={guest.id} 
                      className="dropdown-item"
                      onClick={() => handleGuestSelect(guest)}
                    >
                      <div className="guest-info">
                        <span className="guest-name">{guest.attributes.name}</span>
                        <span className="guest-phone">{guest.attributes.phone_number}</span>
                      </div>
                      <div className="guest-details">
                        <span>{guest.attributes.email || 'No email'}</span>
                        <span>Status: {guest.attributes.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">No guests found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tab-section">
        <div className="tabs">
          <button 
            className={`tab ${selectedTab === 'Math' ? 'active' : ''}`}
            onClick={() => handleTabClick('Math')}
          >
            Math
          </button>
          <button 
            className={`tab ${selectedTab === 'Mission' ? 'active' : ''}`}
            onClick={() => handleTabClick('Mission')}
          >
            Mission
          </button>
        </div>
        <button className="reset-btn" onClick={handleReset}>
          <span className="reset-icon">↻</span> Reset
        </button>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="details-card receipt-details">
            <h2>Receipt Details</h2>
            <div className="receipt-grid">
              <div className="form-group">
                <label>Receipt Number</label>
                <input 
                  type="text" 
                  value={receiptNumber} 
                  disabled 
                />
              </div>
              <div className="form-group">
                <label style={{marginLeft: "30px"}}>Date</label>
                <input 
                  type="text" 
                  value={new Date().toLocaleDateString('en-GB')} 
                  disabled 
                />
              </div>
              <div className="form-group">
                <label>Created by</label>
                <input 
                  type="text" 
                  value={user?.username || 'User Name'} 
                  disabled 
                />
              </div>
            </div>
          </div>

          <div className="details-card donor-details">
            <h2 style={{fontWeight: 'bold', fontSize: '24px', color: '#000'}}>Donor Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Name of Donor</label>
                <div className="donor-unified-input">
                  <div className="donor-custom-select" style={{ position: 'relative' }}>
                    <select
                      value={donorDetails.title}
                      onChange={(e) => setDonorDetails({...donorDetails, title: e.target.value})}
                      style={{
                        appearance: 'none',
                        paddingRight: '24px' // Make room for the arrow
                      }}
                    >
                      <option value="">Title</option>
                      <option value="Sri">Sri</option>
                      <option value="Smt">Smt.</option>
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Swami">Swami</option>
                      <option value="Dr">Dr.</option>
                      <option value="Prof">Prof.</option>
                      <option value="Kumari">Kumari</option>
                      <option value="Ms">Ms.</option>
                    </select>
                    <div style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}>
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M2.5 4.5L6 8L9.5 4.5" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={donorDetails.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setDonorDetails({...donorDetails, name: newName});
                      handleDonorDetailsUpdate({...donorDetails, name: newName});
                    }}
                    className={validationErrors.name ? 'error' : ''}
                  />
                </div>
                {validationErrors.name && (
                  <span className="error-message">{validationErrors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label>Phone No.</label>
                <div className="phone-unified-input">
                  <div className="phone-custom-select" ref={dropdownRef}>
                    <div 
                      className="phone-selected-country" 
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        setTimeout(() => {
                          if (searchInputRef.current) {
                            searchInputRef.current.focus();
                          }
                        }, 0);
                      }}
                    >
                      {donorDetails.phoneCode && (
                        <>
                          <img 
                            src={countryCodes.find(c => `+${c.code}` === donorDetails.phoneCode)?.flagUrl} 
                            alt="" 
                            className="flag-icon" 
                          />
                          {donorDetails.phoneCode}
                        </>
                      )}
                    </div>
                    {isDropdownOpen && (
                      <div className="phone-country-dropdown">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search country..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="phone-country-list">
                          {countryCodes
                            .filter(country => 
                              country.code.includes(searchQuery) ||
                              country.name?.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((country) => (
                              <div
                                key={country.id}
                                className="phone-country-option"
                                onClick={() => {
                                  setDonorDetails({...donorDetails, phoneCode: `+${country.code}`});
                                  setIsDropdownOpen(false);
                                  setSearchQuery("");
                                }}
                              >
                                <img src={country.flagUrl} alt="" className="flag-icon" />
                                <span>+{country.code}</span>
                                <span className="country-name">{country.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input 
                    type="text" 
                    placeholder="9212341902"
                    value={donorDetails.phone}
                    onChange={(e) => setDonorDetails({...donorDetails, phone: e.target.value})}
                  />
                </div>
                {validationErrors.phone && (
                  <span className="error-message">{validationErrors.phone}</span>
                )}
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input 
                  type="email" 
                  placeholder="johndoe87@gmail.com"
                  value={donorDetails.email}
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setDonorDetails({...donorDetails, email: newEmail});
                    setValidationErrors({
                      ...validationErrors,
                      email: validateEmail(newEmail)
                    });
                  }}
                  className={validationErrors.email ? 'error' : ''}
                />
                {validationErrors.email && (
                  <span className="error-message">{validationErrors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label>Mantra Diksha</label>
                <select
                  value={donorDetails.mantraDiksha}
                  onChange={(e) => setDonorDetails({...donorDetails, mantraDiksha: e.target.value})}
                >
                  <option value="">Select Deeksha</option>
                  <option value="Sri Ramakrishna – Life and Teachings">Sri Ramakrishna – Life and Teachings</option>
                  <option value="Sri Sarada Devi – Life and Teachings">Sri Sarada Devi – Life and Teachings</option>
                  <option value="Swami Vivekananda – His Life and Legacy">Swami Vivekananda – His Life and Legacy</option>
                  <option value="The Gospel of Sri Ramakrishna">The Gospel of Sri Ramakrishna</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="form-group">
                <label>Identity type</label>
                <select
                  value={donorDetails.identityType}
                  onChange={(e) => {
                    setDonorDetails({
                      ...donorDetails,
                      identityType: e.target.value,
                      identityNumber: '' // Reset number when type changes
                    });
                    setValidationErrors({
                      ...validationErrors,
                      identityNumber: ''
                    });
                  }}
                >
                  <option value="">Select ID type</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
              <div className="form-group">
                <label>Identity Number</label>
                <input 
                  type="text" 
                  placeholder={
                    donorDetails.identityType === 'Aadhaar' ? "123456789012" :
                    donorDetails.identityType === 'PAN' ? "ABCDE1234F" :
                    donorDetails.identityType === 'Passport' ? "A1234567" :
                    "Enter ID number"
                  }
                  value={donorDetails.identityNumber}
                  onChange={(e) => {
                    let value = e.target.value;
                    
                    // Apply formatting based on type
                    switch (donorDetails.identityType) {
                      case 'Aadhaar':
                        value = value.replace(/\D/g, '').slice(0, 12);
                        break;
                      case 'PAN':
                        value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                        break;
                      case 'Passport':
                        value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
                        break;
                    }
                    
                    setDonorDetails({...donorDetails, identityNumber: value});
                    const error = validateIdentityNumber(donorDetails.identityType, value);
                    setValidationErrors({...validationErrors, identityNumber: error});
                  }}
                  className={validationErrors.identityNumber ? 'error' : ''}
                />
                {validationErrors.identityNumber && (
                  <span className="error-message">{validationErrors.identityNumber}</span>
                )}
              </div>
              <div className="form-group">
                <label>Guest House Room No.</label>
                <input 
                  type="text" 
                  placeholder="Enter Room No."
                  value={donorDetails.roomNumber}
                  onChange={(e) => setDonorDetails({...donorDetails, roomNumber: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="details-card">
            <h2>Address Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Pincode</label>
                <input 
                  type="text" 
                  placeholder="560041"
                  value={donorDetails.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setDonorDetails({...donorDetails, pincode: value});
                    if (value.length === 6) {
                      fetchPincodeDetails(value);
                    }
                  }}
                />
                {isLoadingPincode && <small style={{color: '#666'}}>Loading...</small>}
              </div>
              <div className="form-group">
                <label>State</label>
                <input 
                  type="text" 
                  placeholder="Enter state"
                  value={donorDetails.state}
                  onChange={(e) => setDonorDetails({...donorDetails, state: e.target.value})}
                  readOnly={isLoadingPincode}
                />
              </div>
              <div className="form-group">
                <label>District</label>
                <input 
                  type="text" 
                  placeholder="Enter district"
                  value={donorDetails.district}
                  onChange={(e) => setDonorDetails({...donorDetails, district: e.target.value})}
                  readOnly={isLoadingPincode}
                />
              </div>
              <div className="form-group">
                <label>House Number</label>
                <input 
                  type="text" 
                  placeholder="Enter house number"
                  value={donorDetails.houseNumber}
                  onChange={(e) => setDonorDetails({...donorDetails, houseNumber: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Street Name</label>
                <input 
                  type="text" 
                  placeholder="Enter street name"
                  value={donorDetails.streetName}
                  onChange={(e) => setDonorDetails({...donorDetails, streetName: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="details-card">
            <h2>Donations Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Donation Amount</label>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Enter the amount" 
                    value={currentReceipt?.donationDetails?.amount || ''}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, '');
                      handleDonationDetailsUpdate({ amount: value });
                    }}
                    style={{ border: '1px solid #e7e5eb', padding: "8px 12px", width: "100%" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  value={currentReceipt?.donationDetails?.transactionType || ''}
                  onChange={(e) => handleDonationDetailsUpdate({ transactionType: e.target.value })}
                  style={{fontSize: "14px", padding: "8px 12px", boxShadow: "none", border: "1px solid #e7e5eb"}}
                >
                  <option value="">Select your Reason</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="dd">DD</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>In Memory of</label>
                <input
                  type="text"
                  placeholder="Enter in memory of"
                  value={currentReceipt?.donationDetails?.inMemoryOf || ''}
                  onChange={(e) => handleDonationDetailsUpdate({ inMemoryOf: e.target.value })}
                  style={{fontSize: "14px"}}
                />
              </div>
            </div>
          </div>

          {currentReceipt?.donationDetails?.transactionType && 
           currentReceipt.donationDetails.transactionType !== 'cash' && (
            <div className="details-card">
              <div className="card-header">
                <h2>Transaction Details</h2>
                <button className="consent-btn">Get Consent</button>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>DD/CH Number</label>
                  <input 
                    type="text" 
                    placeholder="DD/CH number"
                    value={currentReceipt?.donationDetails?.transactionDetails?.ddNumber || ''}
                    onChange={(e) => handleDonationDetailsUpdate({ 
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        ddNumber: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>DD/CH date</label>
                  <input 
                    type="date"
                    value={currentReceipt?.donationDetails?.transactionDetails?.ddDate || ''}
                    onChange={(e) => handleDonationDetailsUpdate({ 
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        ddDate: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter the bank name"
                    value={currentReceipt?.donationDetails?.transactionDetails?.bankName || ''}
                    onChange={(e) => handleDonationDetailsUpdate({ 
                      transactionDetails: {
                        ...currentReceipt?.donationDetails?.transactionDetails,
                        bankName: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="donation-footer">
            <div className="total-amount">
              <span className="label">Total Donation Amount</span>
              <span className="amount">₹ {calculateTotalDonations().toLocaleString('en-IN')}</span>
            </div>
            <div className="action-buttons">
              <button 
                className="cancel-btn" 
                type="button" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                className="pending-btn" 
                type="button"
                onClick={handlePending}
              >
                Pending
              </button>
              <button 
                className="print-btn" 
                type="button"
                onClick={() => handlePrintReceipt("completed")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17H17V22H7V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 3H7V8H17V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8H19C20.1046 8 21 8.89543 21 10V16C21 17.1046 20.1046 18 19 18H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>

        <div className="donation-history">
          <h2>Donation History</h2>
          <div className="history-items">
            {donationHistory.length > 0 ? (
              donationHistory
                .filter(donation => donation.attributes.donationFor === selectedTab)
                .map((donation) => {
                  const attributes = donation.attributes;
                  return (
                    <div key={donation.id} className="history-item">
                      <div className="history-header">
                        <span className="date">
                          {new Date(attributes.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`type ${attributes.transactionType?.toLowerCase()}`}>
                          {attributes.transactionType || 'Cash'}
                        </span>
                      </div>
                      <div className="history-details">
                        <div className="detail-row">
                          <span>Receipt No.:</span>
                          <span>{attributes.receipt_detail?.data?.attributes?.Receipt_number || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                          <span>Donation For:</span>
                          <span>{attributes.donationFor}</span>
                        </div>
                        <div className="detail-row">
                          <span>Amount:</span>
                          <span>₹ {parseFloat(attributes.donationAmount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}</span>
                        </div>
                        <div className="detail-row">
                          <span>Status:</span>
                          <span className={`status ${attributes.status?.toLowerCase()}`}>
                            {attributes.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="no-history">
                No donation history available for {selectedTab}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h3>Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this donation?</p>
            <div className="dialog-buttons">
              <button onClick={() => setShowCancelConfirm(false)}>No</button>
              <button onClick={confirmCancel} className="confirm-btn">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDonation;