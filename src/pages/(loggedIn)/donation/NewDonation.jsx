import React, { useState, useEffect, useRef } from "react";
import "./NewDonation.scss";
import { useAuthStore } from "../../../../store/authStore";
import { useDonationStore } from "../../../../donationStore";
import { fetchGuestDetails, createNewGuestDetails } from "../../../../services/src/services/guestDetailsService";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import { createNewDonation, fetchDonationsByField, updateDonationById } from "../../../../services/src/services/donationsService";
import { useNavigate } from 'react-router-dom';

const NewDonation = () => {
  const [selectedTab, setSelectedTab] = useState("Math");
  const [receiptNumber, setReceiptNumber] = useState("");
  const { user } = useAuthStore();
  const { donations, addDonation, updateDonationDetails } = useDonationStore();
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
  const [donorTags, setDonorTags] = useState([{
    id: Date.now(),
    name: "New Donor",
    isNewDonor: true
  }]);
  const [selectedDonor, setSelectedDonor] = useState(Date.now());
  const [guestDetails, setGuestDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState({
    donationDetails: {
      donationType: '',
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPendingConfirm, setShowPendingConfirm] = useState(false);

  console.log("Zustand Store Data:", {
    // auth: { user },
    donations
  });

  React.useEffect(() => {
    const loadGuestDetails = async () => {
      try {
        console.log("Starting to fetch guest details...");
        const details = await fetchGuestDetails();
        console.log("Raw Guest Details Response:", details);
        
        // Log the structure of the data
        console.log("Guest Details Data Structure:", {
          hasData: Boolean(details?.data),
          dataLength: details?.data?.length,
          firstRecord: details?.data?.[0],
          meta: details?.meta
        });

        // Log individual guest records
        if (details?.data?.length > 0) {
          details.data.forEach((guest, index) => {
            console.log(`Guest ${index + 1}:`, {
              id: guest.id,
              attributes: guest.attributes,
              relationships: guest.relationships
            });
          });
        }

        setGuestDetails(details);
      } catch (error) {
        console.error("Error loading guest details:", error);
        console.error("Error stack:", error.stack);
      }
    };

    loadGuestDetails();
  }, []);

  const generateReceiptNumber = (tab) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = tab === 'Mission' ? 'MT' : 'C';
    return `${prefix}${randomNum}`;
  };

  React.useEffect(() => {
    // Skip if no selected donor
    if (!selectedDonor) return;

    // Generate new receipt number when tab changes
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

    // Batch these updates together
    setReceiptNumber(generatedNumber);
    setCurrentReceipt(receiptData);
    addDonation(receiptData);
    
  }, [selectedDonor, selectedTab]); // Dependencies include selectedTab

  // When donor details are updated, update both receipts
  const handleDonorDetailsUpdate = (details) => {
    // Update donor details
    if (currentReceipt?.receiptNumber) {
      updateDonationDetails(currentReceipt.receiptNumber, { donorDetails: details });
    }
    setDonorDetails(details);
    
    // Update the donor tag name when the donor details are updated
    if (details.name) {
      setDonorTags(prevTags => 
        prevTags.map(tag => 
          tag.id === selectedDonor 
            ? { ...tag, name: details.name || "New Donor" }
            : tag
        )
      );
    }
    
    // Update receipts for this donor
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
    const newDonor = {
      id: Date.now(),
      name: "New Donor",
      isNewDonor: true
    };
    
    // Add new donor to the array while preserving existing donors
    setDonorTags(prev => [...prev, newDonor]);
    setSelectedDonor(newDonor.id);
    
    // Reset form for the new donor
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
    } else {
      // For new donors, keep the current name but reset other fields
      const currentTag = donorTags.find(tag => tag.id === id);
      setDonorDetails({
        title: 'Sri',
        name: currentTag?.name || '',  // Keep the current name
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

  // Filter guests based on search term
  const filteredGuests = guestDetails?.data?.filter(guest => {
    const searchLower = searchTerm.toLowerCase();
    const name = guest.attributes.name?.toLowerCase() || '';
    const phone = guest.attributes.phone_number || '';
    return name.includes(searchLower) || phone.includes(searchTerm);
  }) || [];

  // Handle guest selection
  const handleGuestSelect = (guest) => {
    console.log('Selected Guest Data:', {
      guestId: guest.id,
      attributes: guest.attributes,
      fullData: guest
    });
    
    const guestData = guest.attributes;
    
    // Extract address components
    const addressParts = guestData.address?.split(', ') || [];
    const pincode = addressParts[addressParts.length - 1]?.match(/\d{6}/)?.[0] || '';
    const state = addressParts[addressParts.length - 2] || '';
    const district = addressParts[addressParts.length - 3] || '';
    const streetAddress = addressParts.slice(0, addressParts.length - 3).join(', ') || '';

    // Remove the title from the name if it exists at the beginning
    const titleRegex = /^(Sri|Smt\.|Mr\.|Mrs\.|Swami|Dr\.|Prof\.|Kumari|Ms\.)\s*/i;
    const nameWithoutTitle = guestData.name.replace(titleRegex, '').trim();

    const donorDetailsData = {
      title: guestData.title || 'Sri',
      name: nameWithoutTitle, // Use the name without title
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

  const handleTabClick = (tabType) => {
    setSelectedTab(tabType);
    setDonorTabs(prev => ({
      ...prev,
      [selectedDonor]: tabType
    }));
    
    // Generate new receipt number when tab changes
    const newReceiptNumber = generateReceiptNumber(tabType);
    setReceiptNumber(newReceiptNumber);
    
    // Update current receipt with new receipt number
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

  // Add handler for donation details updates
  const handleDonationDetailsUpdate = (details) => {
    if (currentReceipt?.receiptNumber) {
      const updatedDonationDetails = {
        ...currentReceipt.donationDetails,
        ...details,
        // Ensure we preserve transaction details
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
    // Reset donor details
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

  // Add this validation function
  const validateDonationAmount = (amount) => {
    const numAmount = parseFloat(amount);
    return !amount || isNaN(numAmount) || numAmount <= 0;
  };

  // Modify handlePrintReceipt to only show the modal
  const handlePrintReceipt = async () => {
    // Check donation amount first
    if (validateDonationAmount(currentReceipt?.donationDetails?.amount)) {
      alert("Enter the a");
      return;
    }

    // Validate form fields
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

    // Show the modal if validation passes
    setIsModalOpen(true);
  };

  // Move the API calls to handleConfirmPrint
  const handleConfirmPrint = async () => {
    try {
      let guestId = donorDetails.guestId;

      // Check if guestId is present, if not create new guest details
      if (!guestId) {
        const guestPayload = {
          name: `${donorDetails.title} ${donorDetails.name}`,
          phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
          email: donorDetails.email,
          address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
          deeksha: donorDetails.mantraDiksha,
          aadhaar_number: donorDetails.identityType === 'Aadhaar' ? donorDetails.identityNumber : null,
          title: donorDetails.title
        };

        const guestResponse = await createNewGuestDetails(guestPayload);
        guestId = guestResponse.data.id;
      }

      // Create receipt details
      const receiptPayload = {
        Receipt_number: receiptNumber,
        donation_date: new Date().toISOString().split('T')[0],
        createdby: user?.id || 2
      };

      const receiptResponse = await createNewReceiptDetail(receiptPayload);

      if (receiptResponse?.data?.id) {
        const receiptId = receiptResponse.data.id;

        // Get the correct transaction type
        let transactionType = "Cash";
        switch(currentReceipt?.donationDetails?.transactionType?.toLowerCase()) {
          case 'cheque': transactionType = "Cheque"; break;
          case 'bank transfer': transactionType = "Bank Transfer"; break;
          case 'dd': transactionType = "DD"; break;
          case 'm.o': transactionType = "M.O"; break;
          case 'kind': transactionType = "Kind"; break;
          case 'electronic modes': transactionType = "Electronic Modes"; break;
          default: transactionType = "Cash";
        }

        const donationPayload = {
          data: {
            guest: guestId,
            InMemoryOf: "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount || "0",
            transactionType: transactionType,
            donationFor: selectedTab,
            receipt_detail: receiptId,
            status: "completed"
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
        
        // Reset form and close modal
        resetFormData();
        setIsModalOpen(false);
        
        // Navigate to donation page
        navigate('/donation');
        
      } else {
        throw new Error('Invalid receipt response format');
      }
      
    } catch (error) {
      console.error('Error in donation process:', error);
      alert('Error processing donation. Please try again.');
    }
  };

  // Modify the handlePending function
  const handlePending = async () => {
    // Check donation amount first
    if (validateDonationAmount(currentReceipt?.donationDetails?.amount)) {
      alert("Enter the a");
      return;
    }

    // Rest of the existing validation logic
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

    setShowPendingConfirm(true); // Show confirmation dialog instead of direct action
  };

  const confirmPending = async () => {
    try {
      let guestId = donorDetails.guestId;

      // Create new guest details if not exists
      if (!guestId) {
        const guestPayload = {
          name: `${donorDetails.title} ${donorDetails.name}`,
          phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
          email: donorDetails.email,
          address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
          deeksha: donorDetails.mantraDiksha,
          aadhaar_number: donorDetails.identityType === 'Aadhaar' ? donorDetails.identityNumber : null,
          title: donorDetails.title
        };

        const guestResponse = await createNewGuestDetails(guestPayload);
        guestId = guestResponse.data.id;
      }

      // Create receipt details
      const receiptPayload = {
        Receipt_number: receiptNumber,
        donation_date: new Date().toISOString().split('T')[0],
        createdby: user?.id || 2
      };

      const receiptResponse = await createNewReceiptDetail(receiptPayload);

      if (receiptResponse?.data?.id) {
        const receiptId = receiptResponse.data.id;

        // Get the correct transaction type
        let transactionType = "Cash";
        switch(currentReceipt?.donationDetails?.transactionType?.toLowerCase()) {
          case 'cheque': transactionType = "Cheque"; break;
          case 'bank transfer': transactionType = "Bank Transfer"; break;
          case 'dd': transactionType = "DD"; break;
          case 'm.o': transactionType = "M.O"; break;
          case 'kind': transactionType = "Kind"; break;
          case 'electronic modes': transactionType = "Electronic Modes"; break;
          default: transactionType = "Cash";
        }

        const donationPayload = {
          data: {
            guest: guestId,
            InMemoryOf: currentReceipt?.donationDetails?.inMemoryOf || "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount || "0",
            transactionType: transactionType,
            donationFor: selectedTab,
            receipt_detail: receiptId,
            status: "pending" // Set status as pending
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
        console.log('Pending donation created successfully:', donationResponse);
        
        // Reset form and close modal
        resetFormData();
        setShowPendingConfirm(false);
        
        // Navigate to donation page
        navigate('/donation');
        
      } else {
        throw new Error('Invalid receipt response format');
      }
      
    } catch (error) {
      console.error('Error in pending donation process:', error);
      alert('Error processing pending donation. Please try again.');
    }
  };

  // Modify the handleCancel function
  const handleCancel = async () => {
    // Check donation amount first
    if (validateDonationAmount(currentReceipt?.donationDetails?.amount)) {
      alert("Enter the amount");
      return;
    }

    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      let guestId = donorDetails.guestId;

      // Create new guest details if not exists
      if (!guestId) {
        const guestPayload = {
          name: `${donorDetails.title} ${donorDetails.name}`,
          phone_number: `${donorDetails.phoneCode}${donorDetails.phone}`,
          email: donorDetails.email,
          address: `${donorDetails.houseNumber}, ${donorDetails.streetName}, ${donorDetails.district}, ${donorDetails.state}, ${donorDetails.pincode}`,
          deeksha: donorDetails.mantraDiksha,
          aadhaar_number: donorDetails.identityType === 'Aadhaar' ? donorDetails.identityNumber : null,
          title: donorDetails.title
        };

        const guestResponse = await createNewGuestDetails(guestPayload);
        guestId = guestResponse.data.id;
      }

      // Create receipt details
      const receiptPayload = {
        Receipt_number: receiptNumber,
        donation_date: new Date().toISOString().split('T')[0],
        createdby: user?.id || 2
      };

      const receiptResponse = await createNewReceiptDetail(receiptPayload);

      if (receiptResponse?.data?.id) {
        const receiptId = receiptResponse.data.id;

        // Get the correct transaction type
        let transactionType = "Cash";
        switch(currentReceipt?.donationDetails?.transactionType?.toLowerCase()) {
          case 'cheque': transactionType = "Cheque"; break;
          case 'bank transfer': transactionType = "Bank Transfer"; break;
          case 'dd': transactionType = "DD"; break;
          case 'm.o': transactionType = "M.O"; break;
          case 'kind': transactionType = "Kind"; break;
          case 'electronic modes': transactionType = "Electronic Modes"; break;
          default: transactionType = "Cash";
        }

        const donationPayload = {
          data: {
            guest: guestId,
            InMemoryOf: currentReceipt?.donationDetails?.inMemoryOf || "for Thakur Seva",
            donationAmount: currentReceipt?.donationDetails?.amount || "0",
            transactionType: transactionType,
            donationFor: selectedTab,
            receipt_detail: receiptId,
            status: "cancelled" // Set status as cancelled
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
        console.log('Cancelled donation created successfully:', donationResponse);
        
        // Reset form and close modal
        resetFormData();
        setShowCancelConfirm(false);
        
        // Navigate to donation page
        navigate('/donation');
        
      } else {
        throw new Error('Invalid receipt response format');
      }
      
    } catch (error) {
      console.error('Error in cancelling donation:', error);
      alert('Error cancelling donation. Please try again.');
    }
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

  // Modify the condition to show transaction details
  const showTransactionDetails = currentReceipt?.donationDetails?.transactionType && 
    currentReceipt.donationDetails.transactionType.toLowerCase() !== 'cash';

  // Add this function near the top of your component, with other utility functions
  const numberToWords = (num) => {
    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const formatTens = (num) => {
      if (num < 10) return single[num];
      if (num < 20) return double[num - 10];
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + single[num % 10] : '');
    };
    
    const formatHundreds = (num) => {
      if (num < 100) return formatTens(num);
      return single[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + formatTens(num % 100) : '');
    };
    
    const formatLakhs = (num) => {
      if (num < 1000) return formatHundreds(num);
      if (num < 100000) return formatHundreds(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + formatHundreds(num % 1000) : '');
      return formatHundreds(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + formatLakhs(num % 100000) : '');
    };

    if (num === 0) return 'Zero';
    
    const amount = Math.floor(num);
    const paise = Math.round((num - amount) * 100);
    
    let result = formatLakhs(amount);
    if (paise) {
      result += ' and ' + formatTens(paise) + ' Paise';
    }
    
    return result;
  };

  return (
    <div className="donations-container">
      <div className="donor-tags" style={{
        display: 'flex', 
        justifyContent: 'space-between',
        overflowX: 'auto',
        scrollbarWidth: 'none',  // Firefox
        msOverflowStyle: 'none', // IE and Edge
        paddingBottom: '10px',
        '&::-webkit-scrollbar': {  // Chrome, Safari, newer versions of Opera
          display: 'none'
        }
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',  // Space between tags
          flexWrap: 'nowrap',  // Prevent wrapping
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}>        
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
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="info-row">
              <label className="info-label">User: </label>
              <span className="info-data">{user?.username || 'User Name'}</span>
            </div>
            <div className="info-row">
              <label className="info-label">Date: </label>
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
        </div>
      <div style={{display: 'flex', justifyContent: 'space-between', paddingLeft: "20px" }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '20px', gap: '20px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Receipt Number: <span style={{ color: '#6B7280', fontWeight: 'normal' }}>{receiptNumber}</span>
            </div>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'transparent',
                border: 'none',
                color: '#8C52FF',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
              onClick={handleReset}
            >
              <span style={{ fontSize: '16px' }}>↻</span> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="donor-section">
          <div className="details-card donor-details">
            <h2>Donor Details</h2>
            {/* First row with Name, Phone, Mantra Diksha */}
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
                      // Only allow letters and spaces
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
                      // Only allow numbers
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

            {/* Second row with Email, Identity Proof, Room No */}
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
                    // Validate email on change
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
                        identityNumber: '' // Reset number when type changes
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
                      
                      // Apply specific formatting based on ID type
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
                      
                      // Validate based on ID type
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

            {/* Third row with Pincode, State, District */}
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

            {/* Fourth row with House Number and Street Name */}
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
              <label>Donation Type</label>
              <select
                value={currentReceipt?.donationDetails?.donationType || ''}
                onChange={(e) => {
                  handleDonationDetailsUpdate({
                    donationType: e.target.value
                  });
                }}
              >
                <option value="">Select your Reason</option>
                <option value="general">General Donation</option>
                <option value="puja">Puja</option>
                <option value="prasad">Prasad</option>
                <option value="maintenance">Maintenance</option>
                <option value="education">Education</option>
              </select>
            </div>
            <div className="form-group">
              <label>Donation Amount</label>
              <input 
                type="text" 
                placeholder="Enter the amount" 
                value={currentReceipt?.donationDetails?.amount || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers and one decimal point
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
            onClick={handlePrintReceipt}
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
            <div className="warning-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 9L9 15" stroke="#FF4D4F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 9L15 15" stroke="#FF4D4F" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF4D4F" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Are you sure you want to cancel this Donation?</h3>
            <p>Once confirmed, the action will be final and cannot be undone.</p>
            <div className="dialog-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setShowCancelConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmCancel}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            <h2>Receipt Preview</h2>
            <div className="receipt-content">
              <div className="receipt-header">
                <div className="receipt-info">
                  <span>Receipt No: <strong>{receiptNumber}</strong></span>
                  <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
                </div>
              </div>
              <div className="receipt-body">
                <p>Received with thanks from <strong>{donorDetails.title} {donorDetails.name}</strong></p>
                <p>Ramakrishna Math, Kamarpukur, PO: Kamarpukur, Dist: Hoogly, State: West Bengal, Pin: 712612</p>
                <p>The sum of Rupees <strong>{numberToWords(parseFloat(currentReceipt?.donationDetails?.amount || 0))} Only</strong></p>
                <p>By {currentReceipt?.donationDetails?.transactionType || 'Cash'}</p>
                <p>As Donation for {selectedTab}</p>
              </div>
              <div className="receipt-amount">
                <strong>₹ {parseFloat(currentReceipt?.donationDetails?.amount || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</strong>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleConfirmPrint}>
                Confirm & Print
              </button>
            </div>
          </div>
        </div>
      )} */}


      {isModalOpen && (
        <div className="confirmation-dialog">
          <div className="modal-content">
            <div className="model-header">
              <h4>Receipt Preview</h4>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="receipt-content">
              <div className="receipt-header">
                <div className="receipt-info">
                  <span>Receipt No: <strong>{receiptNumber}</strong></span>
                  <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
                </div>
              </div>
              <div className="receipt-body">
                <div className="receipt-thanks">
                  <p>Received with thanks from </p>
                  <div className="receipt-address">
                    <p>Devotees for Daily Prasad
                      <p>Ramakrishna Math, Kamarpukur, PO: Kamarpukur, Dist: Hoogly, State: West Bengal, Pin: 712612</p>
                    </p>
                  </div>
                </div>
                <div className="receipt-amt">
                  <p>The sum of Rupees: </p>
                  <div style={{paddingLeft: '20px'}} className="amt">
                    <p>{numberToWords(parseFloat(currentReceipt?.donationDetails?.amount || 0))} Only</p>
                  </div>
                </div>
                <div className="receipt-amt">
                  <p>By transaction type: </p>
                  <p style={{paddingLeft: '20px'}}>{currentReceipt?.donationDetails?.transactionType || 'Cash'}</p>
                </div>
                <div className="receipt-amt">
                  <p>As Donation for: </p>
                  <p style={{paddingLeft: '20px'}}>{selectedTab}</p>
                </div>
              </div>
              <div className="receipt-amount">
                <strong>₹ {parseFloat(currentReceipt?.donationDetails?.amount || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</strong>
              </div>
            </div>
            <div className="print">
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleConfirmPrint}>
                Confirm & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {showPendingConfirm && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <div className="warning-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V14" stroke="#FFB020" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 17.5V18" stroke="#FFB020" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" 
                  stroke="#FFB020" 
                  strokeWidth="2"
                  fill="none"/>
              </svg>
            </div>
            <h3>Are you sure you want to keep this Donation in pending?</h3>
            <p>Once confirmed, the action will be final and cannot be undone.</p>
            <div className="dialog-buttons">
              <button 
                className="cancel-button" 
                onClick={() => setShowPendingConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmPending}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDonation;