import React from 'react'
import "./recentdonations.scss"

const RecentDonations = () => {
    const donations = [
        {
            receiptNumber: "MI12345",
            donorName: "Mr. John Dee",
            donationDate: "00/00/0000",
            phoneNumber: "+91 98765 43210",
            donatedFor: "Math",
            donationStatus: "Cancelled",
            donationAmount: 7750,
        },
        {
            receiptNumber: "MA12345",
            donorName: "Mr. Sophia William",
            donationDate: "00/00/0000",
            phoneNumber: "+91 98765 43210",
            donatedFor: "Mission",
            donationStatus: "Completed",
            donationAmount: 7750,
        },
        {
            receiptNumber: "MI12345",
            donorName: "Mr. George Cooper",
            donationDate: "00/00/0000",
            phoneNumber: "+91 98765 43210",
            donatedFor: "Math",
            donationStatus: "Pending",
            donationAmount: 10000,
        },
        // Add more sample data here
    ];

    return (
        <>
            <div className="recent-donations-container">
                <div className="donations-header">
                    <p>Recent Donations</p>
                    <a href="/view-all" className="view-all-link">
                        View All
                    </a>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search in table"
                        className="search-input"
                    />
                    <button className="filter-btn">🔍</button>
                </div>
                <table className="donations-table">
                    <thead>
                        <tr>
                            <th>Receipt Number</th>
                            <th>Donor Name</th>
                            <th>Donation Date</th>
                            <th>Phone Number</th>
                            <th>Donated For</th>
                            <th>Donation Status</th>
                            <th>Donation Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation, index) => (
                            <tr key={index}>
                                <td>{donation.receiptNumber}</td>
                                <td>{donation.donorName}</td>
                                <td>{donation.donationDate}</td>
                                <td>{donation.phoneNumber}</td>
                                <td>{donation.donatedFor}</td>
                                <td
                                    className={`status ${donation.donationStatus.toLowerCase()
                                        }`}
                                >
                                    {donation.donationStatus}
                                </td>
                                <td>₹{donation.donationAmount.toLocaleString()}</td>
                                <td className="btns">
                                    {donation.donationStatus === "Pending" ? (
                                        <>
                                            <button className="cancel-btn">Cancel</button>
                                            <button className="submit-btn">Submit</button>
                                        </>
                                    ) : donation.donationStatus === "Completed" ? (
                                        <>
                                            <button className="cancel-btn">Cancel</button>
                                            <button className="print-btn">Print Receipt</button>
                                        </>
                                    ) : (
                                        // Placeholder to maintain height
                                        <div className="placeholder"></div>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default RecentDonations