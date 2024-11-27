import React, { useState } from "react";
import "./Donation.scss";

const NewDonation = () => {
  const [selectedTab, setSelectedTab] = useState("Math");

  return (
    <div className="donations-container">
      <div className="donor-tags">
        <div className="tag">John Dee <span className="close">×</span></div>
        <div className="tag">Abhishek <span className="close">×</span></div>
        <div className="tag">Sagar <span className="close">×</span></div>
        <button className="add-donation-btn">+ Add Donation</button>
      </div>

      <div className="header">
        <h1>New Donation</h1>
        <div className="search-section">
          <div className="search-box">
            <input type="text" placeholder="Search by Name or phone number" />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

      <div className="tab-section">
        <div className="tabs">
          <button 
            className={`tab ${selectedTab === 'Math' ? 'active' : ''}`}
            onClick={() => setSelectedTab('Math')}
          >
            Math
          </button>
          <button 
            className={`tab ${selectedTab === 'Mission' ? 'active' : ''}`}
            onClick={() => setSelectedTab('Mission')}
          >
            Mission
          </button>
        </div>
        <button className="reset-btn">
          <span className="reset-icon">↻</span> Reset
        </button>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="details-card">
            <div className="receipt-grid">
              <div className="form-group">
                <label>Receipt Number</label>
                <input type="text" value="C12077" disabled />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="text" value="24/02/2023" disabled />
              </div>
              <div className="form-group">
                <label>Created by</label>
                <input type="text" value="User Name" disabled />
              </div>
            </div>
          </div>

          <div className="details-card">
            <h2>Donor Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Name of Donor</label>
                <div className="input-group">
                  <select className="title-select">
                    <option>Sri</option>
                  </select>
                  <input type="text" placeholder="John Doe" />
                </div>
              </div>
              <div className="form-group">
                <label>Phone No.</label>
                <div className="input-group">
                  <select className="country-code">
                    <option>+91</option>
                  </select>
                  <input type="text" placeholder="9212341902" />
                </div>
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input type="email" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label>Identity type</label>
                <select>
                  <option>Select ID type</option>
                </select>
              </div>
            </div>
          </div>

          <div className="details-card">
            <h2>Address Details</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Address</label>
                <input type="text" placeholder="Enter address" />
              </div>
              <div className="form-group">
                <label>District</label>
                <input type="text" placeholder="Enter district" />
              </div>
              <div className="form-group">
                <label>State</label>
                <select>
                  <option>Select state</option>
                </select>
              </div>
            </div>
          </div>

          <div className="details-card">
            <h2>Donation Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Donation Amount</label>
                <div className="input-group">
                  <select>
                    <option>₹</option>
                  </select>
                  <input type="text" placeholder="Enter amount" />
                </div>
              </div>
              <div className="form-group">
                <label>Reception Type</label>
                <select>
                  <option>Select type</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>In Memory of</label>
                <input type="text" placeholder="Enter name" />
              </div>
            </div>
          </div>
        </div>

        <div className="donation-history">
          <h2>Donation History</h2>
          <div className="history-items">
            {[{
              date: "12/11/2023",
              type: "Cash",
              room: "GH-29",
              for: "Math",
              amount: "₹10,000.00"
            }].map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-header">
                  <span className="date">{item.date}</span>
                  <span className={`type ${item.type.toLowerCase()}`}>{item.type}</span>
                </div>
                <div className="history-details">
                  <div className="detail-row">
                    <span>Room No.:</span>
                    <span>{item.room}</span>
                  </div>
                  <div className="detail-row">
                    <span>Donation For:</span>
                    <span>{item.for}</span>
                  </div>
                  <div className="detail-row">
                    <span>Amount:</span>
                    <span>{item.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDonation;