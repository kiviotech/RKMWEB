import React from "react";
import "./ReceiptPrint.scss";

const ReceiptPrint = React.forwardRef(({ receiptData }, ref) => {
  return (
    <div ref={ref} className="receipt-print">
      <div className="letterhead">
        <div className="receipt-details">
          <div className="receipt-row">
            <span className="receipt-number">
              No. {receiptData.receiptNumber}
            </span>
            <span className="date">Date: {receiptData.date}</span>
          </div>

          <div className="donor-details">
            <p className="received-from">{receiptData.donorName}</p>
            <p className="address-line">{receiptData.address.line1}</p>
            <p className="address-line">{receiptData.address.line2}</p>
            <p className="state-line">
              {receiptData.address.state}, Pin: {receiptData.address.pincode}
            </p>
            <p className="pan-line">PAN: {receiptData.pan}</p>
          </div>

          <div className="payment-details">
            <p className="rupees-line">{receiptData.amountInWords}</p>
            <p className="payment-mode">{receiptData.paymentMode}</p>
            <p className="purpose-line">{receiptData.purpose}</p>
            <p className="amount">{receiptData.amount}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptPrint;
