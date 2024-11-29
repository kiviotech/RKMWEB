import React, { useState, useEffect } from "react";
import { fetchDonations } from "../../../../services/src/services/donationsService";
import "./AllDonation.scss";

const AllDonation = ({ 
    searchTerm = '', 
    dateRange = {}, 
    selectedStatus = 'ALL', 
    donatedFor = 'ALL',
    currentPage = 1,
    itemsPerPage = 10,
    setTotalPages = () => {}, // Provide default empty function
    filterOptions = { 
        receiptNumber: true,
        donorName: true,
        donationDate: true,
        phoneNumber: true,
        donatedFor: true,
        donationStatus: true,
        donationAmount: true,
        action: true
    } 
}) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDonations = async () => {
            try {
                const response = await fetchDonations();
                console.log('API Response:', response);
                setDonations(response.data || []);
            } catch (err) {
                setError("Failed to load donations");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDonations();
    }, []);

    console.log('Donations state:', donations);

    const filteredDonations = donations.filter(donation => {
        const searchString = (searchTerm || '').toLowerCase();
        const donationDate = donation.attributes.receipt_detail?.data?.attributes?.donation_date;
        
        // Search term filter
        const matchesSearch = 
            donation.attributes.guest?.data?.attributes?.name?.toLowerCase().includes(searchString) ||
            donation.attributes.guest?.data?.attributes?.phone_number?.includes(searchString);

        // Date range filter
        let matchesDateRange = true;
        if (dateRange.startDate && dateRange.endDate) {
            const donationDateTime = new Date(donationDate).getTime();
            const startDateTime = new Date(dateRange.startDate).getTime();
            const endDateTime = new Date(dateRange.endDate).getTime();
            
            matchesDateRange = donationDateTime >= startDateTime && donationDateTime <= endDateTime;
        }

        // Updated status filter
        const matchesStatus = selectedStatus === 'ALL' || 
            donation.attributes.status.toUpperCase() === selectedStatus;

        // Add donatedFor filter
        const matchesDonatedFor = donatedFor === 'ALL' || 
            donation.attributes.donationFor?.toUpperCase() === donatedFor;

        return matchesSearch && matchesDateRange && matchesStatus && matchesDonatedFor;
    });

    // Calculate total pages whenever filtered data changes
    useEffect(() => {
        if (filteredDonations && typeof setTotalPages === 'function') {
            const total = Math.ceil(filteredDonations.length / itemsPerPage);
            setTotalPages(total);
        }
    }, [filteredDonations, itemsPerPage, setTotalPages]);

    // Get current page data
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDonations.slice(startIndex, endIndex);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!Array.isArray(donations)) return <div>No donations available</div>;

    const currentDonations = getCurrentPageData();

    return (
        <div className="all-donations-container">
            <div className="donations-section">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                {filterOptions.receiptNumber && <th>Receipt Number</th>}
                                {filterOptions.donorName && <th>Donor Name</th>}
                                {filterOptions.donationDate && <th>Donation Date</th>}
                                {filterOptions.phoneNumber && <th>Phone Number</th>}
                                {filterOptions.donatedFor && <th>Donated For</th>}
                                {filterOptions.donationStatus && <th>Donation Status</th>}
                                {filterOptions.donationAmount && <th>Donation Amount</th>}
                                {filterOptions.action && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentDonations.map((donation) => (
                                <tr key={donation.id}>
                                    {filterOptions.receiptNumber && 
                                        <td>{donation.attributes.receipt_detail?.data?.attributes?.Receipt_number}</td>}
                                    {filterOptions.donorName && 
                                        <td>{donation.attributes.guest?.data?.attributes?.name}</td>}
                                    {filterOptions.donationDate && 
                                        <td>{donation.attributes.receipt_detail?.data?.attributes?.donation_date}</td>}
                                    {filterOptions.phoneNumber && 
                                        <td>{donation.attributes.guest?.data?.attributes?.phone_number}</td>}
                                    {filterOptions.donatedFor && 
                                        <td>{donation.attributes.donationFor}</td>}
                                    {filterOptions.donationStatus && 
                                        <td>
                                            <span className={`status-badge ${donation.attributes.status.toLowerCase()}`}>
                                                {donation.attributes.status}
                                            </span>
                                        </td>}
                                    {filterOptions.donationAmount && 
                                        <td>{donation.attributes.donationAmount}</td>}
                                    {filterOptions.action && 
                                        <td className="action-cell">
                                            {donation.attributes.status.toLowerCase() === 'pending' && (
                                                <>
                                                    <button className="cancel-btn">
                                                        Cancel
                                                    </button>
                                                    <button className="submit-btn">
                                                        Submit
                                                    </button>
                                                </>
                                            )}
                                            
                                            {donation.attributes.status.toLowerCase() === 'completed' && (
                                                <>
                                                    <button className="cancel-btn">
                                                        Cancel
                                                    </button>
                                                    <button className="print-btn">
                                                        Print Receipt
                                                    </button>
                                                </>
                                            )}
                                        </td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllDonation;
