import { useState, useEffect } from "react";
import "./DonationHistory.scss";
import useDonationStore from "../../../../donationStore";
import { fetchGuestDetails } from "../../../../services/src/services/guestDetailsService";

const DonationHistory = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { donorTabs, activeTabId } = useDonationStore();

  // Function to fetch and process donation history directly
  const refreshGuestData = async () => {
    const currentDonorDetails =
      donorTabs[activeTabId]?.math?.donorDetails ||
      donorTabs[activeTabId]?.mission?.donorDetails;
    
    // If we have a guestId, fetch the latest data
    if (currentDonorDetails?.guestId) {
      setLoading(true);
      try {
        const response = await fetchGuestDetails();
        if (response && response.data) {
          // Find the specific guest
          const guest = response.data.find(g => g.id === currentDonorDetails.guestId);
          
          if (guest) {
            // Extract and process donations directly
            const guestDonations = guest.attributes?.donations?.data || [];
            
            // Format the donations for display
            const formattedDonations = guestDonations.map((donation) => ({
              id: donation.id,
              date: new Date(donation.attributes.createdAt).toLocaleDateString(),
              createdAt: donation.attributes.createdAt,
              donationFor: donation.attributes.donationFor,
              transactionMode: donation.attributes.transactionType,
              amount: donation.attributes.donationAmount,
              status: donation.attributes.status,
            }));
            
            // Sort by date (newest first)
            formattedDonations.sort((a, b) => 
              new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            setDonationHistory(formattedDonations);
          }
        }
      } catch (error) {
        console.error("Error refreshing guest data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Initial loading of donation history from store
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
        id: donation.id,
        date: new Date(donation.attributes.createdAt).toLocaleDateString(),
        createdAt: donation.attributes.createdAt,
        donationFor: donation.attributes.donationFor,
        transactionMode: donation.attributes.transactionType,
        amount: donation.attributes.donationAmount,
        status: donation.attributes.status,
      }));

      // Sort by date (newest first)
      formattedDonations.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setDonationHistory(formattedDonations);
    } else {
      setDonationHistory([]);
    }
  }, [donorTabs, activeTabId]);

  // Add visibility change handler to refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshGuestData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTabId]);

  return (
    <div className="donation-container" style={{ backgroundColor: "#fff" }}>
      <div className="donation-history-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Donation History</h2>
        <button 
          className="refresh-btn" 
          onClick={refreshGuestData}
          disabled={loading}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Refresh donation history"
        >
          {loading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

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
            {loading ? (
              <tr>
                <td colSpan="5" className="loading-message">
                  Refreshing donation history...
                </td>
              </tr>
            ) : donationHistory.length > 0 ? (
              donationHistory.map((donation, index) => (
                <tr key={donation.id || index}>
                  <td>{new Date(donation.date).toLocaleDateString("en-GB")}</td>
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
