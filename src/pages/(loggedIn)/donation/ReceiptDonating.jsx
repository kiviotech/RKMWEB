import React, { useState, useEffect } from "react";
import "./ReceiptDonating.scss";
import icons from "../../../constants/icons";
import { createNewReceiptDetail } from "../../../../services/src/services/receiptDetailsService";
import { useAuthStore } from "../../../../store/authStore";
import { createNewDonation } from "../../../../services/src/services/donationsService";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";

const ReceiptDonating = () => {
  const [selectedOption, setSelectedOption] = useState("Get Consent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
    name: "",
    phone: "",
    email: "",
    uin: "",
  });

  const [donations, setDonations] = useState([
    {
      reason: "",
      amount: "",
      purpose: "",
      transactionType: "",
      ddNumber: "",
      ddDate: "",
      bankName: "",
    },
  ]);

  const [totalDonationAmount, setTotalDonationAmount] = useState(0);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { user } = useAuthStore();

  const [receiptNumber, setReceiptNumber] = useState("");
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadGuests = async () => {
      try {
        const guestData = await fetchGuestDetails();
        console.log("Fetched guests:", guestData);
        const guestsArray = Array.isArray(guestData.data)
          ? guestData.data
          : Array.isArray(guestData)
          ? guestData
          : [];
        setGuests(guestsArray);
      } catch (error) {
        console.error("Error loading guests:", error);
        setGuests([]);
      }
    };
    loadGuests();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setShowDropdown(false);
      setFilteredGuests([]);
      return;
    }

    setShowDropdown(true);

    if (!Array.isArray(guests)) {
      console.error("Guests is not an array:", guests);
      return;
    }

    const filtered = guests.filter((guest) => {
      if (!guest || !guest.attributes) return false;

      const nameMatch = guest.attributes.name?.toLowerCase().includes(term);
      const phoneMatch = guest.attributes.phone_number?.includes(term);

      return nameMatch || phoneMatch;
    });

    setFilteredGuests(filtered);
  };

  const selectGuest = (guest) => {
    setDonorDetails({
      name: guest.attributes.name || "",
      phone: guest.attributes.phone_number || "",
      email: "",
      uin: guest.attributes.aadhaar_number || "",
    });
    setShowDropdown(false);
    setSearchTerm(guest.attributes.name);
  };

  const generateReceiptNumber = (reason) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates random 4-digit number
    if (reason === "Math") {
      return `MT${randomNum}`;
    } else if (reason === "Mission") {
      return `C${randomNum}`;
    }
    return "";
  };

  const handleDonationChange = (index, field, value) => {
    const newDonations = [...donations];
    newDonations[index][field] = value;

    // Generate receipt number when reason is selected
    if (field === "reason") {
      const newReceiptNumber = generateReceiptNumber(value);
      setReceiptNumber(newReceiptNumber);
    }

    // Calculate total when amount changes
    if (field === "amount") {
      const total = newDonations.reduce((sum, donation) => {
        const amount = parseFloat(donation.amount) || 0;
        return sum + amount;
      }, 0);
      setTotalDonationAmount(total);
    }

    setDonations(newDonations);
  };

  const addDonation = () => {
    setDonations([
      ...donations,
      {
        reason: "",
        amount: "",
        purpose: "",
        transactionType: "",
        ddNumber: "",
        ddDate: "",
        bankName: "",
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First create the receipt
      const receiptData = {
        Receipt_number: receiptNumber,
        donation_date: new Date().toISOString().split("T")[0],
        user: user?.id,
        donation: null,
      };

      const receiptResponse = await createNewReceiptDetail(receiptData);

      // Then create each donation
      for (const donation of donations) {
        const donationData = {
          data: {
            guest: "51", // Replace with actual guest ID
            purposeForDonation: donation.purpose,
            donationAmount: parseFloat(donation.amount),
            transactionType: donation.transactionType,
            donationFor: donation.reason,
            ddch_number: donation.ddNumber || null,
            ddch_date: donation.ddDate || null,
            bankName: donation.bankName || null,
            receipt_detail: receiptResponse.data.id,
          },
        };

        await createNewDonation(donationData);
      }

      alert("Receipt and donations created successfully!");
    } catch (error) {
      console.error("Error creating receipt and donations:", error);
      alert("Error creating receipt and donations: " + error.message);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    console.log(`Selected option: ${option}`); // Replace with desired action
  };

  return (
    <div className="receipt-form">
      <div className="form-header">
        <h2>New Donation</h2>
        <div className="search-wrapper">
          <div className="search-container">
            <div className="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by Name or phone number"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="search-button">Search</button>
          </div>
          {showDropdown && searchTerm && (
            <div className="search-dropdown">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="dropdown-item"
                    onClick={() => selectGuest(guest)}
                  >
                    {guest.attributes.name} - {guest.attributes.phone_number}
                  </div>
                ))
              ) : (
                <div className="dropdown-item no-results">
                  No matching results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Receipt Details */}
        <div className="form-section">
          <h3>Receipt Details</h3>
          <div className="receipt-details">
            <div className="row">
              <label>Receipt Number:</label>
              <input type="text" value={receiptNumber} readOnly />
            </div>
            <div className="row">
              <label>Date:</label>
              <input type="date" value={currentDate} readOnly />
            </div>
            <div className="row">
              <label>Initiated By:</label>
              <input
                type="text"
                value={user?.username || "Not logged in"}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Donor Details */}
        <div className="form-section">
          <h3>Donor Details</h3>
          <div className="donor-details">
            <div className="row">
              <label>Name of Donor:</label>
              <input type="text" value={donorDetails.name} readOnly />
            </div>
            <div className="row">
              <label>Phone No.:</label>
              <input type="text" value={donorDetails.phone} readOnly />
            </div>
            <div className="row">
              <label>Email ID:</label>
              <input type="email" value={donorDetails.email} readOnly />
            </div>
            <div className="row">
              <label>UIN:</label>
              <input
                type="text"
                value={donorDetails.uin}
                placeholder="PAN/Aadhaar number"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Donations Details */}
        {/* <div className="form-section">
          <h3>Donations Details</h3>
          <div className="donation-details">
            {donations.map((donation, index) => (
              <>
                <div key={index} className="donation-row">
                  <div className="row">
                    <label>Donation For:</label>
                    <select
                      value={donation.reason}
                      onChange={(e) =>
                        handleDonationChange(index, "reason", e.target.value)
                      }
                    >
                      <option value="">Select your Reason</option>
                      <option value="Math">Math</option>
                      <option value="Mission">Mission</option>
                    </select>
                  </div>
                  <div className="row">
                    <label>Donation Amount:</label>
                    <input
                      type="number"
                      value={donation.amount}
                      onChange={(e) =>
                        handleDonationChange(index, "amount", e.target.value)
                      }
                    />
                  </div>
                  <div className="row">
                    <label>Purpose For Donation:</label>
                    <select
                      value={donation.purpose}
                      onChange={(e) =>
                        handleDonationChange(index, "purpose", e.target.value)
                      }
                    >
                      <option value="">Select your Reason</option>
                      <option value="for Thakur Seva">for Thakur Seva</option>
                    </select>
                  </div>
                  <div className="row">
                    <label>Transaction Type:</label>
                    <select
                      value={donation.transactionType}
                      onChange={(e) =>
                        handleDonationChange(
                          index,
                          "transactionType",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Transaction Type</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="DD">DD</option>
                      <option value="M.O">M.O</option>
                      <option value="Kind">Kind</option>
                      <option value="Electronic Modes">Electronic Modes</option>
                    </select>
                  </div>
                </div>
                <div className="transaction-details">
                  {donation.transactionType &&
                    donation.transactionType !== "Cash" && (
                      <>
                        <h3>Transaction Details</h3>
                        <div className="transaction">
                          <div className="row">
                            <label>DD/CH Number:</label>
                            <input
                              type="text"
                              value={donation.ddNumber}
                              onChange={(e) =>
                                handleDonationChange(
                                  index,
                                  "ddNumber",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="row">
                            <label>DD/CH Date:</label>
                            <input
                              type="date"
                              value={donation.ddDate}
                              onChange={(e) =>
                                handleDonationChange(
                                  index,
                                  "ddDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="row">
                            <label>Bank Name:</label>
                            <input
                              type="text"
                              value={donation.bankName}
                              onChange={(e) =>
                                handleDonationChange(
                                  index,
                                  "bankName",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </>
            ))}
          </div>
          <button type="button" className="add-donor" onClick={addDonation}>
            + Add another Donation
          </button>
        </div> */}

        {/* Total Donation Amount */}
        <div className="form-section total-donation">
          <div>
            <label>Total Donation Amount: </label>
            <input type="number" value={totalDonationAmount} readOnly />
          </div>
          {/* Buttons */}
          <div className="form-buttons">
            <button
              className="get-consent"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedOption}
              <span className="dropdown-arrow">&#x25BC;</span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => handleOptionClick("Online")}
                >
                  Online
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleOptionClick("Offline")}
                >
                  Offline
                </div>
              </div>
            )}
            <button type="submit" className="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReceiptDonating;
