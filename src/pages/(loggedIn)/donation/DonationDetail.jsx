import React, { useState } from 'react';
import useDonationStore from '../../../../useDonationStore';
import "./DonationDetails.scss"; 

const DonationDetails = () => {
    const { donations, setSelectedDonation } = useDonationStore(); // Access donations and the setter function
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDonations = donations.filter(donation =>
        donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.reference.includes(searchQuery)
    );

    // Display the selected donation details
    return (
        <div className="donation-details">
            <div className="header">
                <h3>Donation Details</h3>
                <input 
                    type="text" 
                    placeholder="Search by name or reference" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reference no.</th>
                        <th>Date of Donation</th>
                        <th>Date of Arrival</th>
                        <th>Time until checkout</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonations.map((donation, index) => (
                        <tr 
                            key={index} 
                            style={{ cursor: 'pointer' }} 
                        >
                            <td>{donation.name}</td>
                            <td>{donation.reference}</td>
                            <td>{donation.date}</td>
                            <td>{donation.arrivalDate}</td>
                            <td>{donation.timeUntilCheckout}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DonationDetails;
