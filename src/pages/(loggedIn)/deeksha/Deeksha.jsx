import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaEllipsisV } from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import "./Deeksha.scss";
import {
  fetchDeekshas,
  updateDeekshaById,
} from "../../../../services/src/services/deekshaService";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import useDeekshaFormStore from "../../../../deekshaFormStore";

const Deeksha = () => {
  const navigate = useNavigate();
  const updatePersonalDetails = useDeekshaFormStore(
    (state) => state.updatePersonalDetails
  );

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });

  const [allApplications, setAllApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    name: true,
    mobile: true,
    email: true,
    address: true,
    status: true,
    action: true,
  });

  const filterDropdownRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const loadDeekshas = async () => {
      // console.log("Fetching deekshas...");
      try {
        const response = await fetchDeekshas();
        // console.log("Deekshas fetched successfully:", response);

        // Calculate stats from response data
        const totalApplications = response.data.length;
        const pending = response.data.filter(
          (item) => item.attributes.status === "pending"
        ).length;
        const approvedApplications = response.data.filter(
          (item) => item.attributes.status === "approve"
        ).length;

        // Update stats
        setStats({
          total: totalApplications,
          pending: pending,
          approved: approvedApplications,
        });

        // Store all applications
        const allApplicationsData = response.data.map((item) => ({
          id: item.id,
          name: item.attributes.Name,
          mobile: item.attributes.Phone_no,
          email: item.attributes.Email,
          address: item.attributes.Address,
          status: item.attributes.status,
          aadharNo: item.attributes.Aadhar_no,
          panNo: item.attributes.PAN_no,
          gender: item.attributes.Gender,
          education: item.attributes.Education,
          occupation: item.attributes.Occupation,
          maritalStatus: item.attributes.Marital_status,
          state: item.attributes.State,
          district: item.attributes.District,
          pincode: item.attributes.Pincode,
          country: item.attributes.Country,
          languagesKnown: item.attributes.Languages_known,
          bookletLanguage: item.attributes.Booklet_language,
          disabilities: item.attributes.Disabilities,
          hearingProblems: item.attributes.Hearing_Problems,
          waitingForDeeksha: item.attributes.Waiting_for_Deeksha,
        }));

        // Store all applications in state
        setAllApplications(allApplicationsData);

        // Filter for pending applications for table display
        const pendingApps = allApplicationsData.filter(
          (item) => item.status === "pending"
        );
        setApplications(pendingApps);

        setLoading(false);
      } catch (err) {
        // console.error("Error fetching deekshas:", err);
        setError("Failed to fetch applications");
        setLoading(false);
      }
    };

    loadDeekshas();
  }, []);

  const forms = [
    {
      id: 1,
      title: "Diksha form of Srimat Swami Gautamanandaji Maharaj",
      color: "#FF6B6B",
    },
    {
      id: 2,
      title: "Diksha form of Srimat Swami Suhitanandaji Maharaj",
      color: "#4ECDC4",
    },
    {
      id: 3,
      title: "Diksha form of Srimat Swami Girishanandaji Maharaj",
      color: "#45B7D1",
    },
    {
      id: 4,
      title: "Diksha form of Srimat Swami Vimalatmanandaji Maharaj",
      color: "#96CEB4",
    },
    {
      id: 5,
      title: "Diksha form of Srimat Swami Divyanandaji Maharaj",
      color: "#9B59B6",
    },
  ];

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateDeekshaById(id, {
        data: {
          status: newStatus,
        },
      });

      // Refresh the deekshas list after update
      const response = await fetchDeekshas();

      // Recalculate stats with correct status values
      const totalApplications = response.data.length;
      const pending = response.data.filter(
        (item) => item.attributes.status === "pending"
      ).length;
      const approvedApplications = response.data.filter(
        (item) => item.attributes.status === "approve"
      ).length;

      setStats({
        total: totalApplications,
        pending: pending,
        approved: approvedApplications,
      });

      // Update applications list
      const data = response.data
        .filter((item) => item.attributes.status === "pending")
        .map((item) => ({
          id: item.id,
          name: item.attributes.Name,
          mobile: item.attributes.Phone_no,
          email: item.attributes.Email,
          address: item.attributes.Address,
          status: item.attributes.status,
          aadharNo: item.attributes.Aadhar_no,
          panNo: item.attributes.PAN_no,
          gender: item.attributes.Gender,
          education: item.attributes.Education,
          occupation: item.attributes.Occupation,
          maritalStatus: item.attributes.Marital_status,
          state: item.attributes.State,
          district: item.attributes.District,
          pincode: item.attributes.Pincode,
          country: item.attributes.Country,
          languagesKnown: item.attributes.Languages_known,
          bookletLanguage: item.attributes.Booklet_language,
          disabilities: item.attributes.Disabilities,
          hearingProblems: item.attributes.Hearing_Problems,
          waitingForDeeksha: item.attributes.Waiting_for_Deeksha,
        }));
      setApplications(data);
    } catch (err) {
      console.error("Error updating status:", err);
      // Optionally add error handling UI feedback here
    }
  };

  const handleFilterChange = (field) => {
    setFilterOptions((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const handleExport = () => {
  if (allApplications.length === 0) {
    alert("No applications available to export");
    return;
  }

  // Show loading indicator
  setLoading(true);
  
  setTimeout(() => {
    try {
      // Header rows as in your screenshot (customize event/date/location/guru as needed)
      const header1 = [
        '11/11/23', 'KOLKATA', 'SWAMI SUHITANANDA MAHARAJ', '', '', '', '', '', '', '', '', '', '', '', ''
      ];
      const header2 = [
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ];
      const columns = [
        'SL.No', 'Initiation Number', 'Devotees Name', 'Gender/ Age', 'Qualification', 'Phone', 'Email',
        'ID Proof Type', 'Mailing Language', 'Email', 'SMS', 'Postal', 'Address', 'Diksha Book Language'
      ];

      // Map data to match columns (fill with blanks or 0 as needed)
      const dataRows = allApplications.map((app, idx) => [
        idx + 1,
        app.initiationNumber || '',
        app.name || '',
        app.genderAge || '',
        app.qualification || '',
        app.mobile || '',
        app.email || '',
        app.idProofType || '',
        app.mailingLanguage || '',
        '0', // Email (preference, as in screenshot)
        '0', // SMS (preference)
        '0', // Postal (preference)
        app.address || '',
        app.bookLanguage || ''
      ]);

      // Combine all rows
      const sheetData = [header1, header2, columns, ...dataRows];

      // Create worksheet and workbook
      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // Merge header cells for event/date/location/guru row (A1:O1)
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }
      ];

      // Set column widths for readability
      ws['!cols'] = [
        { wch: 8 },  // SL.No
        { wch: 18 }, // Initiation Number
        { wch: 24 }, // Devotees Name
        { wch: 12 }, // Gender/ Age
        { wch: 16 }, // Qualification
        { wch: 15 }, // Phone
        { wch: 28 }, // Email
        { wch: 18 }, // ID Proof Type
        { wch: 18 }, // Mailing Language
        { wch: 8 },  // Email (pref)
        { wch: 8 },  // SMS (pref)
        { wch: 8 },  // Postal (pref)
        { wch: 40 }, // Address
        { wch: 18 }  // Diksha Book Language
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Deeksha Report');

      // Generate filename with current date
      const today = new Date();
      const date = today.toISOString().split('T')[0];
      const filename = `Deeksha_Report_${date}.xlsx`;

      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, 300);
};

const handleSendReminder = (data) => {
  setModalData(data);
  setIsModalOpen(true);

  // Auto close after 3 seconds
  setTimeout(() => {
    setIsModalOpen(false);
    setModalData(null);
  }, 3000);
};

const handleFormClick = (guruName) => {
  // Update the store with the selected guru's name
  updatePersonalDetails({ guruji: guruName });
  // Navigate to the form page
  navigate("/deeksha-form");
};

return (
  <div className="deeksha-page">
    <div className="deeksha-container">
      <div className="left-section">
        {/* Statistics Cards */}
        <div className="stats-container-main">
          <div className="stats-card purple">
            <h2>{stats.total}</h2>
            <p>Total Applications</p>
          </div>
          <div className="stats-card orange">
            <h2>{stats.pending}</h2>
            <p>Pending Applications</p>
          </div>
          <div className="stats-card green">
            <h2>{stats.approved}</h2>
            <p>Approved Applications</p>
          </div>
        </div>

          {/* Upcoming Diksha Section */}
          <div className="upcoming-diksha">
            <h2>Upcoming Diksha</h2>
            <div className="event-card">
              <div className="event-details">
                <h2>Srimat Swami Divyanandaji Maharaj</h2>
                <div className="date">
                  <FaCalendarAlt className="icon" />
                  <span>15.02.2025, 17.02.2025 & 18.02.2025</span>
                </div>
                <div className="location">
                  <FaMapMarkerAlt className="icon" />
                  <span>Main Prayer Hall, Ramakrishna Math, Kolkata</span>
                </div>
              </div>

              <button
                className="reminder-btn"
                onClick={() =>
                  handleSendReminder({
                    date: "25th November 2024, 10:00 AM",
                    location: "Main Prayer Hall, Ramakrishna Math, Kolkata",
                  })
                }
              >
                Send reminder
              </button>
              <button className="reminder-btn">view schedule</button>
            </div>
          </div>
        </div>

        <div className="right-section">
          {/* Diksha Forms Section */}
          <div className="forms-section">
            <h2>Diksha Initiation Forms</h2>
            <div className="forms-list">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="form-item"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleFormClick(form.title.replace("Diksha form of ", ""))
                  }
                >
                  <BsFileEarmarkText
                    className="form-icon"
                    style={{ color: form.color }}
                  />
                  <span className="form-title">{form.title}</span>
                  <button
                    className="more-options"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaEllipsisV />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table Section */}
      <div className="applications-table-container">
        <div className="table-header">
          <h2>Diksha Initiation Application</h2>
          <div className="header-actions">
            <button className="export-btn" onClick={handleExport}>
              <FiUpload className="export-icon" />
              Export
            </button>
            <div className="filter-dropdown-container">
              <button
                className="filter-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterPopup(!showFilterPopup);
                }}
              >
                <TbAdjustmentsHorizontal />
              </button>
              {showFilterPopup && (
                <div className="filter-dropdown" ref={filterDropdownRef}>
                  <div className="filter-options">
                    {Object.entries(filterOptions).map(([field, checked]) => (
                      <label key={field} className="filter-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleFilterChange(field)}
                        />
                        <span>
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="filter-actions">
                    <button
                      className="reset-btn"
                      onClick={() =>
                        setFilterOptions(
                          Object.fromEntries(
                            Object.keys(filterOptions).map((key) => [key, true])
                          )
                        )
                      }
                    >
                      Reset
                    </button>
                    <button
                      className="apply-btn"
                      onClick={() => setShowFilterPopup(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : applications.length > 0 ? (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Sl No.</th>
                {filterOptions.name && <th>Name</th>}
                {filterOptions.mobile && <th>Mobile Number</th>}
                {filterOptions.email && <th>E-mail</th>}
                {filterOptions.address && <th>Address</th>}
                {filterOptions.action && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1}</td>
                  {filterOptions.name && <td>{app.name}</td>}
                  {filterOptions.mobile && <td>{app.mobile}</td>}
                  {filterOptions.email && <td>{app.email}</td>}
                  {filterOptions.address && <td>{app.address}</td>}
                  {filterOptions.action && (
                    <td className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusUpdate(app.id, "approve")}
                        disabled={app.status === "approve"}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusUpdate(app.id, "reject")}
                        disabled={app.status === "reject"}
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No applications found</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content animate-slide">
            <div className="success-animation">
              <div className="checkmark">✓</div>
            </div>
            <h2>Reminder Sent Successfully!</h2>
            <p>Date: {modalData.date}</p>
            <p>Location: {modalData.location}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Add some basic styles for the modal
const modalStyles = `
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
}

.animate-slide {
    animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
    0% {
        transform: translateY(-100px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.success-animation {
    margin: 20px auto;
}

.checkmark {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4CAF50;
    color: white;
    font-size: 30px;
    margin: 0 auto;
    animation: scaleIn 0.3s ease-out forwards;
}

@keyframes scaleIn {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.modal-content h2 {
    color: #333;
    margin: 20px 0;
}

.modal-content p {
    color: #666;
    margin: 10px 0;
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = modalStyles;
document.head.appendChild(styleSheet);

export default Deeksha;
