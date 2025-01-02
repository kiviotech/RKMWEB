const ConsentLetterTemplate = ({ donationData, formatDate, numberToWords }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @media print {
            body {
              padding: 5px;
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.2;
            }
            @page {
              size: A4;
              margin: 20mm;
            }
            .header-info p {
              margin: 0;
              line-height: 1.4;
            }
            .header-info {
              margin-bottom: 15px;  /* Add space after ID NO */
            }
            .address p {
              margin: 0;
              line-height: 1.2;
            }
          }
        </style>
      </head>
      <body>
        <div class="consent-letter">
          <h2 style="text-align: center; margin-bottom: 5px;">CONSENT LETTER</h2>

          <div class="header-info">
            <p>Date: ${formatDate(donationData.donationDate)}</p>
            <p>ID NO: ${donationData.uniqueDonorId}</p>
          </div>

          <div class="address">
            <p>To</p>
            <p>The Adhyaksha</p>
            <p>Ramakrishna Math</p>
            <p>Vill. & P.O.: Kamarpukur</p>
            <p>Dist.: Hooghly, West Bengal, Pin - 712 612</p>
          </div>

          <p>Revered Maharaj,</p>

          <p style="margin-top: 5px;">
            I am donating a sum of Rs. ${
              donationData.amount
            }/- (${numberToWords(donationData.amount)} only)
            by ${donationData.transactionType} as ${
    donationData.donationType
  } for ${donationData.purpose}.
          </p>

          <p>Please accept and oblige.</p>

          <p>With pranams,</p>

          <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
            <p>Yours sincerely,</p>
          </div>

          <div style="margin-top: 5px;">
            <p style="margin: 0;">${donationData.title} ${donationData.name}</p>
            ${
              donationData.houseNumber || donationData.streetName
                ? `<p style="margin: 0;">Vill: ${[
                    donationData.houseNumber,
                    donationData.streetName,
                  ]
                    .filter(Boolean)
                    .join(", ")}</p>`
                : ""
            }
            ${
              donationData.postOffice || donationData.district
                ? `<p style="margin: 0;">${[
                    donationData.postOffice
                      ? `PO: ${donationData.postOffice}`
                      : "",
                    donationData.district
                      ? `Dist: ${donationData.district}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(", ")}</p>`
                : ""
            }
            ${
              donationData.state || donationData.pincode
                ? `<p style="margin: 0;">${[
                    donationData.state ? `State: ${donationData.state}` : "",
                    donationData.pincode ? `Pin: ${donationData.pincode}` : "",
                  ]
                    .filter(Boolean)
                    .join(", ")}</p>`
                : ""
            }
            <p style="margin: 0;">${[
              donationData.panNumber ? `PAN: ${donationData.panNumber}` : "",
              donationData.phone ? `Mobile No.: ${donationData.phone}` : "",
            ]
              .filter(Boolean)
              .join(", ")}</p>
            ${
              donationData.inMemoryOf
                ? `<p style="margin: 0;">In Memory of ${donationData.inMemoryOf}</p>`
                : ""
            }
          </div>

          <div style="margin-top: 10px; border-top: 1px solid #000; padding-top: 5px;">
            <h3 style="text-align: center; margin-bottom: 3px;">FOR OFFICE USE ONLY</h3>
            <p>Receipt No.: ${donationData.receiptNumber}, dated ${formatDate(
    donationData.donationDate
  )}</p>
            <p>By ${donationData.transactionType}</p>
            <p>Issued by hand / Send by Post</p>
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

export default ConsentLetterTemplate;
