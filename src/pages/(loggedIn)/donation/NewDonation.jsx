import React, { useState, useEffect, useRef } from "react";
import "./NewDonation.scss";
import { useAuthStore } from "../../../../store/authStore";
import { useDonationStore } from "../../../../donationStore";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import { createNewDonation } from "../../../../services/src/services/donationsService";
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
    identityType: 'Aadhaar',
    identityNumber: '',
    roomNumber: '',
    pincode: '',
    houseNumber: '',
    streetName: '',
    district: '',
    state: ''
  });
  const [currentReceipt, setCurrentReceipt] = useState({
    donationDetails: {
      amount: '',
      transactionType: 'cash',
      inMemoryOf: '',
      transactionDetails: {
        ddNumber: '',
        ddDate: '',
        bankName: ''
      }
    }
  });
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
    if (!selectedDonor) return;

    if (!receiptNumber) {
      const generatedNumber = generateReceiptNumber(selectedTab);
      
      const receiptData = {
        receiptNumber: generatedNumber,
        date: new Date().toLocaleDateString(),
        createdBy: user?.username || 'N/A',
        type: selectedTab,
        status: 'pending',
        amount: 0,
        donorId: selectedDonor,
        donorDetails: donorDetails,
        donationDetails: {
          amount: '',
          transactionType: 'cash',
          inMemoryOf: '',
          transactionDetails: {
            ddNumber: '',
            ddDate: '',
            bankName: ''
          }
        }
      };

      setReceiptNumber(generatedNumber);
      setCurrentReceipt(receiptData);
      addDonation(receiptData);
    }
  }, [selectedDonor, selectedTab]);

  const handleTabClick = (tabType) => {
    setSelectedTab(tabType);
    setDonorTabs(prev => ({
      ...prev,
      [selectedDonor]: tabType
    }));
    
    const newReceiptNumber = generateReceiptNumber(tabType);
    setReceiptNumber(newReceiptNumber);
    
    if (currentReceipt) {
      const updatedReceipt = {
        ...currentReceipt,
        receiptNumber: newReceiptNumber,
        type: tabType
      };
      setCurrentReceipt(updatedReceipt);
      addDonation(updatedReceipt);
    }
  };

  const handleReset = () => {
    if (!selectedDonor || !currentReceipt) return;

    const newReceiptNumber = generateReceiptNumber(selectedTab);
    setReceiptNumber(newReceiptNumber);

    const resetReceipt = {
      receiptNumber: newReceiptNumber,
      date: new Date().toLocaleDateString(),
      createdBy: user?.username || 'N/A',
      type: selectedTab,
      status: 'pending',
      amount: 0,
      donorId: selectedDonor,
      donorDetails: donorDetails,
      donationDetails: {
        amount: '',
        transactionType: 'cash',
        inMemoryOf: '',
        transactionDetails: {
          ddNumber: '',
          ddDate: '',
          bankName: ''
        }
      }
    };

    setCurrentReceipt(resetReceipt);
    addDonation(resetReceipt);
  };

  const handleAddDonation = () => {
    const newDonor = {
      id: Date.now(),
      name: "New Donor",
      isNewDonor: true
    };
    setDonorTags(prev => [...prev, newDonor]);
    setSelectedDonor(newDonor.id);
    
    const newReceiptNumber = generateReceiptNumber(selectedTab);
    setReceiptNumber(newReceiptNumber);
    
    setDonorDetails({
      title: 'Sri',
      name: '',
      phoneCode: '+91',
      phone: '',
      email: '',
      mantraDiksha: '',
      identityType: 'Aadhaar',
      identityNumber: '',
      roomNumber: '',
      pincode: '',
      houseNumber: '',
      streetName: '',
      district: '',
      state: ''
    });

    const newReceipt = {
      receiptNumber: newReceiptNumber,
      date: new Date().toLocaleDateString(),
      createdBy: user?.username || 'N/A',
      type: selectedTab,
      status: 'pending',
      amount: 0,
      donorId: newDonor.id,
      donorDetails: donorDetails,
      donationDetails: {
        amount: '',
        transactionType: 'cash',
        inMemoryOf: '',
        transactionDetails: {
          ddNumber: '',
          ddDate: '',
          bankName: ''
        }
      }
    };

    setCurrentReceipt(newReceipt);
    addDonation(newReceipt);
  };

  const handleRemoveTag = (idToRemove) => {
    setDonorTags(donorTags.filter(tag => tag.id !== idToRemove));
    setSelectedDonor(null);
    setDonorDetails({
      title: 'Sri',
      name: '',
      phoneCode: '+91',
      phone: '',
      email: '',
      mantraDiksha: '',
      identityType: 'Aadhaar',
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
    setSelectedTab(donorTabs[id] || 'Math');
    
    const donorReceipts = donations.receipts.find(group => 
      Array.isArray(group) && 
      group.length > 0 && 
      (group[0].donorId === id || group[0].donorDetails?.guestId === id)
    ) || [];

    const firstReceipt = donorReceipts[0];
    
    if (firstReceipt?.donorDetails) {
      setDonorDetails(firstReceipt.donorDetails);
    } else if (id === donorTags.find(tag => tag.isNewDonor)?.id) {
      setDonorDetails({
        title: 'Sri',
        name: '',
        phoneCode: '+91',
        phone: '',
        email: '',
        mantraDiksha: '',
        identityType: 'Aadhaar',
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

  const filteredGuests = guestDetails?.data?.filter(guest => {
    const searchLower = searchTerm.toLowerCase();
    const name = guest.attributes.name?.toLowerCase() || '';
    const phone = guest.attributes.phone_number || '';
    return name.includes(searchLower) || phone.includes(searchTerm);
  }) || [];

  const handleGuestSelect = (guest) => {
    console.log('Selected Guest Data:', {
      guestId: guest.id,
      attributes: guest.attributes,
      fullData: guest
    });
    
    const guestData = guest.attributes;
    
    const addressParts = guestData.address?.split(', ') || [];
    const pincode = addressParts[addressParts.length - 1]?.match(/\d{6}/)?.[0] || '';
    const state = addressParts[addressParts.length - 2] || '';
    const district = addressParts[addressParts.length - 3] || '';
    const streetAddress = addressParts.slice(0, addressParts.length - 3).join(', ') || '';

    const donorDetailsData = {
      title: guestData.title || 'Sri',
      name: guestData.name.replace(guestData.title, '').trim() || '',
      phoneCode: '+91',
      phone: guestData.phone_number?.replace('+91', '') || '',
      email: guestData.email || '',
      mantraDiksha: guestData.deeksha || '',
      identityType: 'Aadhaar',
      identityNumber: guestData.aadhaar_number || '',
      roomNumber: '',
      pincode: pincode,
      houseNumber: '',
      streetName: streetAddress,
      district: district,
      state: state,
      guestId: guest.id
    };

    handleDonorDetailsUpdate(donorDetailsData);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleDonorDetailsUpdate = (details) => {
    if (currentReceipt?.receiptNumber) {
      updateDonationDetails(currentReceipt.receiptNumber, { donorDetails: details });
    }
    setDonorDetails(details);
    
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

  const handleDonationDetailsUpdate = (details) => {
    if (currentReceipt?.receiptNumber) {
      const updatedDonationDetails = {
        ...currentReceipt.donationDetails,
        ...details,
        transactionDetails: {
          ...(currentReceipt.donationDetails?.transactionDetails || {}),
          ...(details.transactionDetails || {})
        }
      };
      
      setCurrentReceipt({
        ...currentReceipt,
        donationDetails: updatedDonationDetails
      });
      
      updateDonationDetails(currentReceipt.receiptNumber, updatedDonationDetails);
    }
  };

  const resetFormData = () => {
    setDonorDetails({
      title: 'Sri',
      name: '',
      phoneCode: '+91',
      phone: '',
      email: '',
      mantraDiksha: '',
      identityType: 'Aadhaar',
      identityNumber: '',
      roomNumber: '',
      pincode: '',
      houseNumber: '',
      streetName: '',
      district: '',
      state: ''
    });

    setReceiptNumber('');
    setCurrentReceipt(null);

    setDonorTags([{
      id: Date.now(),
      name: "New Donor",
      isNewDonor: true
    }]);
    setSelectedDonor(Date.now());

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
      const receiptPayload = {
        Receipt_number: receiptNumber,
        donation_date: new Date().toISOString().split('T')[0],
        createdby: user?.id || 2
      };

      const receiptResponse = await createNewReceiptDetail(receiptPayload);
      
      if (receiptResponse?.data?.id) {
        const receiptId = receiptResponse.data.id;
        console.log('Receipt Details ID:', receiptId);

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
        
        resetFormData();
        
        alert('Donation submitted successfully!');
        navigate('/donation');
        
      } else {
        throw new Error('Invalid receipt response format');
      }
      
    } catch (error) {
      console.error('Error in donation process:', error);
      alert('Error processing donation. Please try again.');
    }
  };

  const handlePending = async () => {
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
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateAadhaar = (number) => {
    if (!number) return '';
    if (!/^\d{12}$/.test(number)) {
      return 'Aadhaar number must be exactly 12 digits';
    }
    return '';
  };

  const validatePAN = (number) => {
    if (!number) return '';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number)) {
      return 'PAN must be in format: ABCDE1234F';
    }
    return '';
  };

  const validatePassport = (number) => {
    if (!number) return '';
    if (!/^[A-Z]{1}[0-9]{7}$/.test(number)) {
      return 'Passport must be in format: A1234567';
    }
    return '';
  };

  const isFormValid = () => {
    if (!donorDetails.name || !donorDetails.phone) {
      return false;
    }

    if (validationErrors.name || validationErrors.phone || validationErrors.email) {
      return false;
    }

    return true;
  };

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

  useEffect(() => {
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

  const showTransactionDetails = currentReceipt?.donationDetails?.transactionType && 
    currentReceipt.donationDetails.transactionType.toLowerCase() !== 'cash';

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
        <div className="top-right-info">
          <div className="form-group scrollable">
            <label className="info-label">User:</label>
            <span className="info-data">{user?.username || 'User Name'}</span>
          </div>
          <div className="form-group scrollable">
            <label className="info-label">Date:</label>
            <span className="info-data">{new Date().toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>

      <div className="header">
        <h1>New Donation</h1>
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
          <div className="receipt-number">
            Receipt No: <span>{receiptNumber}</span>
          </div>
        </div>
        <button className="reset-btn" onClick={handleReset}>
          <span className="reset-icon">↻</span> Reset
        </button>
      </div>

      <div className="main-content">
        <div className="donor-section">
          <div className="details-card donor-details">
            <h2>Donor Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Name of Donor</label>
                <div className="donor-unified-input">
                  <select
                    value={donorDetails.title}
                    onChange={(e) => setDonorDetails({...donorDetails, title: e.target.value})}
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
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={donorDetails.name}
                    onChange={(e) => {
                      const newName = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setDonorDetails({...donorDetails, name: newName});
                      setSearchTerm(newName);
                      setShowDropdown(true);
                      const nameError = validateName(newName);
                      setValidationErrors(prev => ({
                        ...prev,
                        name: nameError
                      }));
                    }}
                    className={validationErrors.name ? 'error' : ''}
                  />
                  {validationErrors.name && (
                    <span className="error-message">{validationErrors.name}</span>
                  )}
                  {showDropdown && searchTerm && filteredGuests.length > 0 && (
                    <div className="search-dropdown">
                      {filteredGuests.map(guest => (
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
                            <span>{guest.attributes.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Phone No.</label>
                <div className="phone-unified-input">
                  <select
                    value={donorDetails.phoneCode}
                    onChange={(e) => setDonorDetails({...donorDetails, phoneCode: e.target.value})}
                  >
                    <option value="+91">+91</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="9212341902"
                    value={donorDetails.phone}
                    onChange={(e) => {
                      const newPhone = e.target.value.replace(/\D/g, '');
                      setDonorDetails({...donorDetails, phone: newPhone});
                      const phoneError = validatePhone(newPhone);
                      setValidationErrors(prev => ({
                        ...prev,
                        phone: phoneError
                      }));
                    }}
                    className={validationErrors.phone ? 'error' : ''}
                  />
                  {validationErrors.phone && (
                    <span className="error-message">{validationErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Mantra Diksha</label>
                <select
                  value={donorDetails.mantraDiksha}
                  onChange={(e) => setDonorDetails({...donorDetails, mantraDiksha: e.target.value})}
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
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email ID</label>
                <input 
                  type="email"
                  placeholder="johndoe87@gmail.com"
                  value={donorDetails.email}
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setDonorDetails({...donorDetails, email: newEmail});
                    const emailError = validateEmail(newEmail);
                    setValidationErrors(prev => ({
                      ...prev,
                      email: emailError
                    }));
                  }}
                />
                {validationErrors.email && (
                  <span className="error-message">{validationErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Identity Proof</label>
                <div className="identity-unified-input">
                  <select
                    value={donorDetails.identityType}
                    onChange={(e) => {
                      setDonorDetails({
                        ...donorDetails, 
                        identityType: e.target.value,
                        identityNumber: ''
                      });
                      setValidationErrors(prev => ({
                        ...prev,
                        identityNumber: ''
                      }));
                    }}
                  >
                    <option value="">Select ID type</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder={
                      donorDetails.identityType === 'Aadhaar' ? '12 digit number' :
                      donorDetails.identityType === 'PAN' ? 'ABCDE1234F' :
                      donorDetails.identityType === 'Passport' ? 'A1234567' :
                      'Enter ID number'
                    }
                    value={donorDetails.identityNumber}
                    onChange={(e) => {
                      let value = e.target.value;
                      
                      switch (donorDetails.identityType) {
                        case 'Aadhaar':
                          value = value.replace(/\D/g, '').slice(0, 12);
                          break;
                        case 'PAN':
                          value = value.toUpperCase().slice(0, 10);
                          break;
                        case 'Passport':
                          value = value.toUpperCase().slice(0, 8);
                          break;
                      }
                      
                      setDonorDetails({...donorDetails, identityNumber: value});
                      
                      let error = '';
                      switch (donorDetails.identityType) {
                        case 'Aadhaar':
                          error = validateAadhaar(value);
                          break;
                        case 'PAN':
                          error = validatePAN(value);
                          break;
                        case 'Passport':
                          error = validatePassport(value);
                          break;
                      }
                      
                      setValidationErrors(prev => ({
                        ...prev,
                        identityNumber: error
                      }));
                    }}
                    className={validationErrors.identityNumber ? 'error' : ''}
                  />
                </div>
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

            <div className="form-row">
              <div className="form-group">
                <label>Pincode <span className="required">*</span></label>
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
              </div>

              <div className="form-group">
                <label>State <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={donorDetails.state}
                  onChange={(e) => setDonorDetails({...donorDetails, state: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>District <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Enter district"
                  value={donorDetails.district}
                  onChange={(e) => setDonorDetails({...donorDetails, district: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
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
                <label>Streetname</label>
                <input 
                  type="text" 
                  placeholder="Enter street name"
                  value={donorDetails.streetName}
                  onChange={(e) => setDonorDetails({...donorDetails, streetName: e.target.value})}
                />
              </div>
            </div>
          </div>

          {showTransactionDetails && (
            <div className="details-card transaction-details">
              <div className="card-header">
                <h2>Transaction details</h2>
                <button className="consent-btn">Get Consent</button>
              </div>
              <div className="form-group">
                <label>DD/CH Date</label>
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
                <label>Bank Name</label>
                <input 
                  type="text" 
                  placeholder="Enter the amount"
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
          )}

          <div className="details-card donation-history">
            <h2>Donation History</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Donation for</th>
                  <th>Transaction Mode</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {guestDetails?.data?.find(g => g.id === donorDetails.guestId)?.attributes?.donations?.data?.length > 0 ? (
                  guestDetails.data
                    .find(g => g.id === donorDetails.guestId)
                    ?.attributes?.donations?.data
                    .map((donation) => {
                      const attributes = donation.attributes;
                      return (
                        <tr key={donation.id}>
                          <td>{new Date(attributes.createdAt).toLocaleDateString()}</td>
                          <td>{attributes.donationFor}</td>
                          <td>
                            <span className={attributes.transactionType?.toLowerCase()}>
                              {attributes.transactionType}
                            </span>
                          </td>
                          <td>₹{parseFloat(attributes.donationAmount || 0).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}</td>
                          <td>
                            <span className={`status ${attributes.status?.toLowerCase()}`}>
                              {attributes.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="5" className="no-history">
                      No donation history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="donation-section">
          <div className="details-card donation-details">
            <h2>Donations Details</h2>
            <div className="form-group">
              <label>Donation Amount</label>
              <input 
                type="text" 
                placeholder="Enter the amount" 
                value={currentReceipt?.donationDetails?.amount || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    const updatedDonationDetails = {
                      ...currentReceipt?.donationDetails,
                      amount: value
                    };
                    
                    if (currentReceipt?.receiptNumber) {
                      const updatedReceipt = {
                        ...currentReceipt,
                        donationDetails: updatedDonationDetails
                      };
                      setCurrentReceipt(updatedReceipt);
                      updateDonationDetails(currentReceipt.receiptNumber, updatedDonationDetails);
                    }
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>Transaction Type</label>
              <select
                value={currentReceipt?.donationDetails?.transactionType || 'cash'}
                onChange={(e) => {
                  const newType = e.target.value;
                  handleDonationDetailsUpdate({
                    ...currentReceipt?.donationDetails,
                    transactionType: newType
                  });
                }}
              >
                <option value="cash">Cash</option>
                <option value="dd">DD</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            <div className="form-group">
              <label>In Memory of</label>
              <input
                type="text"
                placeholder="Enter in memory of"
                value={currentReceipt?.donationDetails?.inMemoryOf || ''}
                onChange={(e) => {
                  handleDonationDetailsUpdate({
                    inMemoryOf: e.target.value
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

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
            className="print-receipt-btn" 
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