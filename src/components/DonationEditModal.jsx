import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './DonationEditModal.scss';
import { updateDonationById } from '../../services/src/services/donationsService';
import { createDonationAuditLog } from '../../services/auditLog';
import { sendNotification } from '../../services/notificationService';
import { useAuthStore } from '../../store/authStore';

const DonationEditModal = ({ isOpen, onClose, donation }) => {
  const [formData, setFormData] = useState({
    donationAmount: '',
    donationFor: '',
    status: '',
    paymentMethod: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (donation) {
      // Backend might store status in either uppercase or lowercase, so normalize it
      const status = donation.attributes.status || '';
      
      setFormData({
        donationAmount: donation.attributes.donationAmount || '',
        donationFor: donation.attributes.donationFor || '',
        status: status.toLowerCase(), // Ensure status is lowercase to match dropdown values
        paymentMethod: donation.attributes.paymentMethod || '',
        description: donation.attributes.description || ''
      });
    }
  }, [donation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create a data object to track changes
      const changedFields = {};
      const originalData = {
        donationAmount: donation.attributes.donationAmount,
        donationFor: donation.attributes.donationFor,
        status: donation.attributes.status,
        paymentMethod: donation.attributes.paymentMethod,
        description: donation.attributes.description
      };

      // Track which fields were changed
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          changedFields[key] = {
            from: originalData[key],
            to: formData[key]
          };
        }
      });

      // Only proceed if there are changes
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes were made to the donation");
        onClose();
        return;
      }

      // Update the donation
      const response = await updateDonationById(donation.id, {
        donationAmount: formData.donationAmount,
        donationFor: formData.donationFor,
        // Convert status to lowercase to match API expectations
        status: formData.status.toLowerCase(),
        paymentMethod: formData.paymentMethod,
        description: formData.description
      });

      // Create donation-specific audit log
      await createDonationAuditLog({
        donationId: donation.id,
        changes: changedFields,
        metadata: {
          donorName: donation.attributes.guest?.data?.attributes?.name,
          receiptNumber: donation.attributes.receiptNo,
          action: 'DONATION_EDIT',
          performedBy: user.username,
          role: user.role?.type || user.user_role
        }
      });

      // Send notification to super admins - temporarily disabled due to backend service issue
      try {
        console.log('[INFO] Attempting to send notification (may fail due to backend issues)');
        await sendNotification({
          type: 'DONATION_EDITED',
          message: `Donation #${donation.attributes.receiptNo} was edited by ${user.username}`,
          targetRole: 'super-admin',
          resourceId: donation.id,
          resourceType: 'donation',
          data: {
            changes: changedFields,
            donorName: donation.attributes.guest?.data?.attributes?.name
          }
        });
      } catch (notificationError) {
        console.error('Notification sending failed, but continuing operation:', notificationError);
        // Still allow the edit to succeed even if notification fails
      }

      toast.success("Donation updated successfully");
      onClose(true); // Pass true to indicate successful update
    } catch (err) {
      console.error("Error updating donation:", err);
      setError("Failed to update donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !donation) return null;

  return (
    <div className="donation-edit-overlay">
      <div className="donation-edit-modal">
        <div className="modal-header">
          <h2>Edit Donation</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="donation-edit-form">
          <div className="donor-info">
            <p><strong>Donor:</strong> {donation.attributes.guest?.data?.attributes?.name}</p>
            <p><strong>Receipt #:</strong> {donation.attributes.receiptNo}</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="donationAmount">Donation Amount</label>
            <input
              type="number"
              id="donationAmount"
              name="donationAmount"
              value={formData.donationAmount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="donationFor">Donation For</label>
            <input
              type="text"
              id="donationFor"
              name="donationFor"
              value={formData.donationFor}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationEditModal;
