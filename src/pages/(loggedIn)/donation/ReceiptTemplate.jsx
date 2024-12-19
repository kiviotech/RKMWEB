import React from "react";

const ReceiptTemplate = ({
  uniqueDonorId,
  receiptNumber,
  formattedDate,
  donorDetails,
  currentReceipt,
  numberToWords,
}) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Ramakrishna Math Letterhead</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background-color: #fff;
                font-family: Arial, sans-serif;
              }

              .letterhead {
                width: 672 px;
                margin: 0 auto;
              }

              .header {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                margin-bottom: 40px;
              }

              .logo {
                width: 100px;
                height: auto;
              }

              .title-section {
                flex: 1;
              }

              h1 {
                margin: 0;
                color: #4b3968;
                font-size: 24px;
                text-align: center;
              }

              .subtitle {
                margin: 5px 0;
                font-size: 14px;
                text-align: center;
                color: #4b3968;
              }

              .address {
                margin: 5px 0;
                font-size: 14px;
                text-align: center;
                color: #4b3968;
              }

              .contact {
                margin: 5px 0;
                font-size: 12px;
                text-align: center;
                color: #4b3968;
              }

              .signature-section {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
                margin-bottom: 20px;
                position: relative;
              }

              .received {
                margin: 0 0 5px 0;
                color: #4b3968;
                font-size: 14px;
              }

              .adhyaksha {
                position: absolute;
                right: 0;
                margin: 0;
                padding-top: 5px;
                min-width: 150px;
                text-align: center;
                color: #4b3968;
                font-size: 14px;
              }

              .donation-text {
                font-size: 14px;
                color: #4b3968;
                line-height: 1.6;
                margin: 20px 0 0 0;
                padding: 5px 0 0 0;
                font-weight: 600;
                letter-spacing: 0.2px;
                border-top: 1px solid #4b3968;
              }

              .receipt-details {
                margin: 70px 0px;
                line-height: 2;
                font-size: 16px;
              }

              .receipt-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-size: 16px;
              }

              .donor-details p {
                margin: 0;
                line-height: 2;
                font-size: 16px;
              }

              .donor-details p:not(:first-child) {
                margin-left: 40px;
              }

              .payment-details p {
                margin: 0;
                line-height: 2;
                font-size: 16px;
              }

              .amount {
                font-size: 18px;
                font-weight: bold;
              }

              b {
                font-size: 18px;
              }
              .stamp-container {
                position: relative;
                width: 100%;
              }

              .it-stamp {
                position: absolute;
                right: 20px;
                top: -130px;
                transform: translateY(-50%);
                border: 2px solid #000;
                padding: 8px;
                font-size: 11px;
                font-weight: 600;
                line-height: 1.2;
                max-width: 400px;
                text-align: center;
                background-color: transparent;
              }
            </style>
          </head>
          <body>
            <div class="letterhead">
              <div class="receipt-details">
                <div class="receipt-row">
                  <span>Receipt <b>No: ${uniqueDonorId} / ${receiptNumber}</b></span>
                  <span class="date">Date: <b>${formattedDate}</b></span>
                </div>
                <div class="donor-details">
                  <p style="margin: 0 0 5px 0;">
                    Received with thanks from
                    <b>${donorDetails.title} ${donorDetails.name}</b>
                  </p>
                  <div style="margin-left: 190px; font-weight: bold;">
                    <p style="margin: 0 0 5px 0;">
                      ${donorDetails.houseNumber || ""}${
    donorDetails.streetName ? `, ${donorDetails.streetName}` : ""
  }
                    </p>
                    <p style="margin: 0 0 5px 0;">
                      ${
                        donorDetails.postOffice
                          ? `PO: ${donorDetails.postOffice}, `
                          : ""
                      }${
    donorDetails.district ? `Dist: ${donorDetails.district}` : ""
  }
                    </p>
                    <p style="margin: 0 0 5px 0;">
                      ${
                        donorDetails.state
                          ? `State: ${donorDetails.state}, `
                          : ""
                      }${
    donorDetails.pincode ? `Pin: ${donorDetails.pincode}` : ""
  }
                    ${
                      donorDetails.identityNumber
                        ? `
                    <p style="margin: 0 0 5px 0;">
                      ${
                        donorDetails.identityType === "PAN"
                          ? `PAN: ${donorDetails.identityNumber}`
                          : `Aadhaar: ${donorDetails.identityNumber}`
                      }
                      </p>
                  `
                        : ""
                    }
                  </div>
                </div>
<div class="payment-details">
  <p style="margin: 10px 0">
    The sum of Rupees
    <b
      >${numberToWords(
        parseFloat(currentReceipt?.donationDetails?.amount || 0)
      )} Only</b
    >
  </p>

  <div style="display: flex; align-items: center; flex-wrap: wrap;">
    <p style="margin: 0;">
      By ${currentReceipt?.donationDetails?.transactionType || "Cash"}
    </p>
    ${
      currentReceipt?.donationDetails?.transactionType?.toLowerCase() !== "cash"
        ? `
    <p style="margin: 0; padding-left: 10px;">
      Dt. ${currentReceipt?.donationDetails?.transactionDetails?.ddDate || ""}
    </p>
    <p style="margin: 0; width: 100%;">
      On ${currentReceipt?.donationDetails?.transactionDetails?.bankName || ""}
    </p>
    `
        : ""
    }
  </div>

  <p>
    As Donation for ${currentReceipt?.donationDetails?.donationType} for ${
    currentReceipt?.donationDetails?.purpose === "Other"
      ? currentReceipt?.donationDetails?.otherPurpose
      : currentReceipt?.donationDetails?.purpose
  }${
    currentReceipt?.donationDetails?.inMemoryOf
      ? ` in memory of ${currentReceipt?.donationDetails?.inMemoryOf}`
      : ""
  }
  </p>
  <p class="amount">
    <b
      >Rs. ${parseFloat(
        currentReceipt?.donationDetails?.amount || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</b
    >
  </p>
   ${
     ["Bank Transfer", "Cheque", "DD", "Electronic Modes"].includes(
       currentReceipt?.donationDetails?.transactionType
     )
       ? `<div class="stamp-container">
                <div class="it-stamp">
                  Donations are exempt under Clause (i) of first proviso to<br>
                  sub-section (5) of Section 80G of Income Tax Act 1961,<br>
                  vide Provisional Approval No. AAATR3497PF2021A<br>
                  dated 28-05-2021 valid from AY 2022-23 to AY 2026-27
                </div>
              </div>`
       : ""
   }
</div>

              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }
            </script>
          </body>
        </html>
  `;
};

export default ReceiptTemplate;
