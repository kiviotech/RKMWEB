import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaEllipsisV } from 'react-icons/fa';
import { BsFileEarmarkText } from 'react-icons/bs';
import { FiUpload } from 'react-icons/fi';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import './Deeksha.scss';
import { fetchDeekshas, updateDeekshaById } from '../../../../services/src/services/deekshaService';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const Deeksha = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0
    });

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
        action: true
    });

    const filterDropdownRef = useRef(null);

    useEffect(() => {
        const loadDeekshas = async () => {
            console.log('Fetching deekshas...');
            try {
                const response = await fetchDeekshas();
                console.log('Deekshas fetched successfully:', response);
                
                // Calculate stats from response data
                const totalApplications = response.data.length;
                const pendingApplications = response.data.filter(item => 
                    item.attributes.status === "pending"
                ).length;
                const approvedApplications = response.data.filter(item => 
                    item.attributes.status === "approve"
                ).length;

                // Update stats
                setStats({
                    total: totalApplications,
                    pending: pendingApplications,
                    approved: approvedApplications
                });

                // Map data for applications table - filter for pending status only
                const data = response.data
                    .filter(item => item.attributes.status === "pending")
                    .map(item => ({
                        id: item.id,
                        name: item.attributes.Name,
                        mobile: item.attributes.Phone_no,
                        email: item.attributes.Email,
                        address: item.attributes.Address,
                        status: item.attributes.status
                    }));
                setApplications(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching deekshas:', err);
                setError('Failed to fetch applications');
                setLoading(false);
            }
        };

        loadDeekshas();
    }, []);

    const forms = [
        { id: 1, title: 'Diksha form of Srimat Swami Gautamanandaji Maharaj' },
        { id: 2, title: 'Diksha form of Srimat Swami Gautamanandaji Maharaj' },
        { id: 3, title: 'Diksha form of Srimat Swami Gautamanandaji Maharaj' },
        { id: 4, title: 'Diksha form of Srimat Swami Gautamanandaji Maharaj' }
    ];

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateDeekshaById(id, {
                data: {
                    status: newStatus
                }
            });
            
            // Refresh the deekshas list after update
            const response = await fetchDeekshas();
            
            // Recalculate stats with correct status values
            const totalApplications = response.data.length;
            const pendingApplications = response.data.filter(item => 
                item.attributes.status === "pending"
            ).length;
            const approvedApplications = response.data.filter(item => 
                item.attributes.status === "approve"
            ).length;

            setStats({
                total: totalApplications,
                pending: pendingApplications,
                approved: approvedApplications
            });

            // Update applications list
            const data = response.data
                .filter(item => item.attributes.status === "pending")
                .map(item => ({
                    id: item.id,
                    name: item.attributes.Name,
                    mobile: item.attributes.Phone_no,
                    email: item.attributes.Email,
                    address: item.attributes.Address,
                    status: item.attributes.status
                }));
            setApplications(data);
        } catch (err) {
            console.error('Error updating status:', err);
            // Optionally add error handling UI feedback here
        }
    };

    const handleFilterChange = (field) => {
        setFilterOptions(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setShowFilterPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleExport = () => {
        // Prepare data for export
        const exportData = applications.map((app, index) => ({
            'Sl No.': index + 1,
            Name: app.name,
            'Mobile Number': app.mobile,
            'E-mail': app.email,
            Address: app.address,
            Status: app.status
        }));

        // Create a new workbook and add the data
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'Deeksha_Applications.xlsx');
    };

    return (
        <div className="deeksha-page">
            <div className="deeksha-container">
                <div className="left-section">
                    {/* Statistics Cards */}
                    <div className="stats-container">
                        <div className="stat-card purple">
                            <h2>{stats.total}</h2>
                            <p>Total Applications</p>
                        </div>
                        <div className="stat-card orange">
                            <h2>{stats.pending}</h2>
                            <p>Pending Applications</p>
                        </div>
                        <div className="stat-card green">
                            <h2>{stats.approved}</h2>
                            <p>Approved Applications</p>
                        </div>
                    </div>

                    {/* Upcoming Diksha Section */}
                    <div className="upcoming-diksha">
                        <h2>Upcoming Diksha</h2>
                        <div className="event-card">
                            <div className="event-details">
                                <div className="date">
                                    <FaCalendarAlt className="icon" />
                                    <span>25th November 2024, 10:00 AM</span>
                                </div>
                                <div className="location">
                                    <FaMapMarkerAlt className="icon" />
                                    <span>Main Prayer Hall, Ramakrishna Math, Kolkata</span>
                                </div>
                            </div>
                            <button className="reminder-btn">Send reminder</button>
                        </div>
                    </div>
                </div>

                <div className="right-section" onClick={() => navigate('/deeksha-form')}>
                    {/* Diksha Forms Section */}
                    <div className="forms-section">
                        <h2>Diksha Initiation Forms</h2>
                        <div className="forms-list">
                            {forms.map((form) => (
                                <div 
                                    key={form.id} 
                                    className="form-item"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <BsFileEarmarkText className="form-icon" />
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
                                                <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="filter-actions">
                                        <button 
                                            className="reset-btn" 
                                            onClick={() => setFilterOptions(Object.fromEntries(Object.keys(filterOptions).map(key => [key, true])))}
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
        </div>
    );
};

export default Deeksha;

