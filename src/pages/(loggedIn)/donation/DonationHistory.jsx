import { useState, useEffect } from "react";
import "./DonationHistory.scss";
import useDonationStore from "../../../../donationStore";

const DonationHistory = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const { donorTabs, activeTabId } = useDonationStore();

  useEffect(() => {
    const currentDonorDetails =
      donorTabs[activeTabId]?.math?.donorDetails ||
      donorTabs[activeTabId]?.mission?.donorDetails;

    // If we have a guestId, extract donation history from the guest data
    if (currentDonorDetails?.guestId) {
      const guestDonations =
        currentDonorDetails.guestData?.attributes?.donations?.data || [];

      // Format the donations for display
      const formattedDonations = guestDonations.map((donation) => ({
        date: new Date(donation.attributes.createdAt).toLocaleDateString(),
        donationFor: donation.attributes.donationFor,
        transactionMode: donation.attributes.transactionType,
        amount: donation.attributes.donationAmount,
        status: donation.attributes.status,
      }));

      setDonationHistory(formattedDonations);
    } else {
      setDonationHistory([]);
    }
  }, [donorTabs, activeTabId]);

  return (
    <div className="donation-container" style={{ backgroundColor: "#fff" }}>
      <h2>Donation History</h2>

      <div className="table-wrapper">
        <table className="donation-table">
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
            {donationHistory.length > 0 ? (
              donationHistory.map((donation, index) => (
                <tr key={index}>
                  <td>{donation.date}</td>
                  <td>{donation.donationFor}</td>
                  <td>{donation.transactionMode}</td>
                  <td>₹{donation.amount}</td>
                  <td>{donation.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-message">
                  No donation history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationHistory;
