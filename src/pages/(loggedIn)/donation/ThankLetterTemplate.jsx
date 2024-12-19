const ThankLetterTemplate = ({ donationData, formatDate, numberToWords }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @media print {
            body {
              padding: 5px;
              max-width: 800px;
              margin: 25mm auto;
              line-height: 1.6;
              font-size: 12pt;
            }
            @page {
              size: A4;
              margin: 15mm 20mm;
            }
            .header-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 25px;
            }
            .donor-address {
              margin-bottom: 25px;
            }
            .donor-address p {
              margin: 0;
              line-height: 1.4;
            }
            .acknowledgment {
              margin: 25px 0;
              line-height: 1.6;
            }
            .receipt-reference {
              margin: 20px 0;
              line-height: 1.4;
            }
            .prayer-section {
              margin: 20px 0;
              line-height: 1.4;
            }
            .signature-section {
              margin-top: 35px;
            }
            .enclosure {
              margin-top: 25px;
            }
            .border-box {
              margin-top: 20px;
              padding: 10px;
              border: 1px solid #000;
            }
          }
        </style>
      </head>
      <body>
        <div class="thank-letter">
          <div class="header-section">
            <div class="ref-numbers">
              <p>Ref. No.: PFDON/2024</p>
              <p>ID NO: ${donationData.uniqueDonorId}</p>
            </div>
            <div class="date">
              <p>Date: ${formatDate(donationData.donationDate)}</p>
            </div>
          </div>

          <div class="donor-address">
            <p>To</p>
            <p>${donationData.title} ${donationData.name}</p>
            <p>${
              donationData.houseNumber
                ? `Vill: ${donationData.houseNumber}`
                : ""
            }${
    donationData.streetName ? `, ${donationData.streetName}` : ""
  }</p>
            <p>${
              donationData.postOffice ? `PO: ${donationData.postOffice}` : ""
            }${
    donationData.district ? `, Dist: ${donationData.district}` : ""
  }</p>
            <p>${donationData.state ? `State: ${donationData.state}` : ""}${
    donationData.pincode ? `, Pin: ${donationData.pincode}` : ""
  }</p>
          </div>

          <p>Respected ${donationData.title} ${donationData.name},</p>

          <div class="acknowledgment">
            <p>We, thankfully acknowledge your kind and generous contribution of Rs. ${
              donationData.amount
            }/- (${numberToWords(donationData.amount)} only) ${
    donationData.transactionType
      ? `by ${donationData.transactionType.toLowerCase()}`
      : ""
  } ${donationData.donationType ? `as ${donationData.donationType}` : ""} ${
    donationData.purpose
      ? `for ${
          donationData.purpose === "Other"
            ? donationData.otherPurpose || ""
            : donationData.purpose
        }`
      : ""
  }${
    donationData.inMemoryOf ? ` in memory of ${donationData.inMemoryOf}` : ""
  }.</p>
          </div>

          <div class="receipt-reference">
            <p>Please find attached herewith the official Receipt vide no. (${
              donationData.receiptNumber
            }, dated ${formatDate(
    donationData.donationDate
  )}) for this contribution.</p>
          </div>

          <div class="prayer-section">
            <p>We pray to Sri Ramakrishna, Sri Maa Sarada Devi and Sri Swamiji Maharaj that they may bestow their choicest blessings upon you and members of your family!</p>
          </div>

          <p style="margin-top: 20px;">With best wishes and namaskars,</p>

          <div style="margin-top: 30px; text-align: right;">
            <p>Yours sincerely,</p>
            <p style="margin-top: 20px; margin-bottom: 0;">(Swami Lokottarananda)</p>
            <p style="margin-top: 0;">Adhyaksha</p>
          </div>

          <p style="margin-top: 20px;">Encl: As stated above.</p>

          <div style="border: 1px solid #000; text-align: center;">
            <span>Please Mention Your Id (${
              donationData.uniqueDonorId
            }) In The Future Correspondences.</span>
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

export default ThankLetterTemplate;
