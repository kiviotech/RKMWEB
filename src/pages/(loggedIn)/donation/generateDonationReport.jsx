const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

export const generateDonationReport = (donations, reportType) => {
  // Group donations based on mode first
  const groupedByMode = donations.reduce((acc, donation) => {
    const mode = donation.attributes.transactionType || "Unknown";
    if (!acc[mode]) {
      acc[mode] = {
        total: 0,
        types: {},
      };
    }

    // Only add to totals if donation is not cancelled
    const amount =
      donation.attributes.status === "cancelled"
        ? 0
        : parseFloat(donation.attributes.donationAmount || 0);

    // Calculate mode total
    acc[mode].total += amount;

    // Group by type within each mode
    const type = donation.attributes.type || "Unknown";
    if (!acc[mode].types[type]) {
      acc[mode].types[type] = {
        total: 0,
        purposes: {},
      };
    }

    // Calculate type total
    acc[mode].types[type].total += amount;

    // Group by purpose within each type
    const purpose = donation.attributes.purpose || "General";
    if (!acc[mode].types[type].purposes[purpose]) {
      acc[mode].types[type].purposes[purpose] = {
        total: 0,
        donations: [],
      };
    }

    // Calculate purpose total and store donation
    acc[mode].types[type].purposes[purpose].total += amount;
    acc[mode].types[type].purposes[purpose].donations.push(donation);

    return acc;
  }, {});

  const grandTotal = donations.reduce(
    (sum, donation) =>
      sum +
      (donation.attributes.status === "cancelled"
        ? 0
        : parseFloat(donation.attributes.donationAmount || 0)),
    0
  );

  return `
    <html>
      <head>
        <title>${reportType} Receipt List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
          }
          .page-title {
            text-align: center;
            font-size: 16px;
            margin-bottom: 15px;
            line-height: 1.4;
            border: 1px solid #eee;
            padding: 5px;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .header-table th {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            line-height: 1.4;
          }
          .section {
            margin-bottom: 15px;
          }
          .mode-type {
            margin-bottom: 10px;
            line-height: 1.8;
          }
          .mode-line {
            position: relative;
            padding-right: 150px;
          }
          .amount-right {
            position: absolute;
            right: 0;
            font-weight: bold;
          }
          .amount-middle {
            position: absolute;
            right: 0;
            font-weight: bold;
            margin-right: 150px;
          }
          .purpose-group {
            margin-bottom: 15px;
          }
          .purpose-title {
            margin-bottom: 8px;
            line-height: 1.4;
            font-weight: bold;
          }
          .receipt-row {
            display: grid;
            grid-template-columns: 80px 100px 120px 120px 200px 100px;
            margin-bottom: 5px;
            border-bottom: 1px solid #eee;
            gap: 10px;
            line-height: 1.6;
            padding: 4px 0;
          }
          .amount {
            text-align: center;
            font-weight: bold;
            width: 100%;
            white-space: nowrap;
            padding-right: 10px;
          }
          .total {
            text-align: right;
            margin-top: 5px;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .grand-total {
            text-align: center;
            margin-top: 20px;
            font-weight: bold;
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 15px 0;
            line-height: 1.4;
          }
          .grand-total-amount {
            float: right;
          }
          .mode-type-total {
            margin-top: 10px;
            margin-bottom: 20px;
            padding: 5px;
            font-weight: bold;
            text-align: right;
          }
          .purpose-total {
            float: right;
            font-weight: bold;
          }
          .mode-line-top {
            font-weight: bold;
            font-size: 16px;
          }
          .left {
            padding-left: 10px;
          }
          .right {
            padding-right: 10px;
          }
        </style>
      </head>
      <body>
        <div class="page-title">
          Receipt List For ${formatDate(new Date())} - ${reportType} Receipt
        </div>
        
        <table class="header-table">
          <tr>
            <th>Receipt No</th>
            <th>Receipt Date</th>
            <th>DD/CH No</th>
            <th>DD/CH/Bank Tr. Date</th>
            <th>Bank Name</th>
            <th>Amount</th>
          </tr>
        </table>

        ${Object.entries(groupedByMode)
          .map(
            ([mode, modeData]) => `
            <div class="section">
              <div class="mode-type">
                <div class="mode-line mode-line-top">
                  Receipt Mode: ${mode} <span class="amount-middle">Total:</span> <span class="amount-right">Rs. ${modeData.total.toFixed(
              2
            )}</span>
                </div>
                ${Object.entries(modeData.types)
                  .map(
                    ([type, typeData]) => `
                    <div class="mode-line mode-line-top left">
                      Type: ${type} <span class="amount-middle">Total:</span> <span class="amount-right">Rs. ${typeData.total.toFixed(
                      2
                    )}</span>
                    </div>
                    ${Object.entries(typeData.purposes)
                      .map(
                        ([purpose, purposeData]) => `
                        <div class="purpose-group">
                          <div class="purpose-title left">
                            Purpose: ${purpose} <span class="purpose-total">Rs. ${purposeData.total.toFixed(
                          2
                        )}</span>
                          </div>
                          ${purposeData.donations
                            .map(
                              (donation) => `
                              <div class="receipt-row left">
                                <div>${
                                  donation.attributes.receipt_detail?.data
                                    ?.attributes?.Receipt_number || ""
                                }</div>
                                <div>${formatDate(
                                  donation.attributes.createdAt
                                )}</div>
                                <div>
                                  ${donation.attributes.donorName || ""}
                                  ${
                                    donation.attributes.status === "cancelled"
                                      ? " Cancelled"
                                      : ""
                                  }
                                </div>
                                <div>${formatDate(
                                  donation.attributes.ddch_date
                                )}</div>
                                <div>${
                                  donation.attributes.bankName
                                    ? `${donation.attributes.bankName} - ${donation.attributes.ddch_number}`
                                    : ""
                                }</div>
                                <div class="amount">Rs. ${
                                  donation.attributes.donationAmount
                                }</div>
                              </div>
                            `
                            )
                            .join("")}
                        </div>
                      `
                      )
                      .join("")}
                  `
                  )
                  .join("")}
              </div>
            </div>
          `
          )
          .join("")}

        <div class="grand-total">
          Grand Total (Including all payment modes):
          <span class="grand-total-amount">Rs. ${grandTotal.toFixed(2)}</span>
        </div>
      </body>
    </html>
  `;
};
