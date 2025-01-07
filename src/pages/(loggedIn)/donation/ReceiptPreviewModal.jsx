import React from "react";
import ReceiptTemplate from "./ReceiptTemplate";

const ReceiptPreviewModal = ({
  isOpen,
  onClose,
  receiptData,
  onConfirmPrint,
}) => {
  if (!isOpen) return null;

  // Helper function to convert number to words
  const numberToWords = (num) => {
    const single = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const double = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const formatTens = (num) => {
      if (num < 10) return single[num];
      if (num < 20) return double[num - 10];
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + single[num % 10] : "")
      );
    };

    if (num === 0) return "Zero";

    const convert = (num) => {
      if (num < 100) return formatTens(num);
      if (num < 1000)
        return (
          single[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " " + formatTens(num % 100) : "")
        );
      if (num < 100000)
        return (
          convert(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + convert(num % 1000) : "")
        );
      if (num < 10000000)
        return (
          convert(Math.floor(num / 100000)) +
          " Lakh" +
          (num % 100000 ? " " + convert(num % 100000) : "")
        );
      return (
        convert(Math.floor(num / 10000000)) +
        " Crore" +
        (num % 10000000 ? " " + convert(num % 10000000) : "")
      );
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num % 1) * 100);
    let result = convert(rupees) + " Rupees";
    if (paise) {
      result += " and " + convert(paise) + " Paise";
    }
    return result;
  };

  const handlePrintReceipt = () => {
    if (!validateFields()) return;

    const currentTab = donorTabs[activeTabId];
    const currentDonorDetails = currentTab[currentSection].donorDetails;
    const currentDonationDetails = currentTab[currentSection].donationDetails;
    const currentTransactionDetails =
      currentTab[currentSection].transactionDetails;

    const amount = parseFloat(currentDonationDetails.amount) || 0;

    setReceiptData({
      receiptNumber: currentTab.receiptNumbers[currentSection],
      uniqueNo: currentTab.uniqueNo,
      date: new Date().toLocaleDateString(),
      donorName: `${currentDonorDetails.title} ${currentDonorDetails.name}`,
      address: {
        flatNo: currentDonorDetails.flatNo,
        postOffice: currentDonorDetails.postOffice,
        district: currentDonorDetails.district,
        state: currentDonorDetails.state,
        pincode: currentDonorDetails.pincode,
      },
      transactionType: transactionType,
      donationType: currentDonationDetails.donationType,
      amount: amount.toFixed(2),
      purpose: currentDonationDetails.purpose,
      otherPurpose: currentDonationDetails.specifiedPurpose,
      identityType: currentDonorDetails.identityType,
      identityNumber: currentDonorDetails.identityNumber,
      inMemoryOf: currentDonationDetails.inMemoryOf,
      transactionDetails: {
        date: currentTransactionDetails?.date,
        transactionId: currentTransactionDetails?.transactionId,
        bankName: currentTransactionDetails?.bankName,
        branchName: currentTransactionDetails?.branchName,
      },
      user: user,
    });

    setShowReceiptPreview(true);
  };

  const handlePrint = () => {
    // Create a temporary hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    // Generate receipt content
    const receiptContent = ReceiptTemplate({
      uniqueDonorId: receiptData.uniqueNo,
      receiptNumber: receiptData.receiptNumber,
      formattedDate: receiptData.date,
      donorDetails: {
        title: receiptData.title || "",
        name: receiptData.donorName,
        houseNumber: receiptData.address?.flatNo,
        streetName: receiptData.address?.streetName,
        postOffice: receiptData.address?.postOffice,
        district: receiptData.address?.district,
        state: receiptData.address?.state,
        pincode: receiptData.address?.pincode,
        identityType: receiptData.identityType,
        identityNumber: receiptData.identityNumber,
      },
      currentReceipt: {
        donationDetails: {
          amount: receiptData.amount,
          transactionType: receiptData.transactionType,
          donationType: receiptData.donationType,
          purpose: receiptData.purpose,
          otherPurpose: receiptData.otherPurpose,
          inMemoryOf: receiptData.inMemoryOf,
          transactionDetails: {
            transactionId: receiptData.transactionDetails?.transactionId,
            ddDate: receiptData.transactionDetails?.date,
            bankName: receiptData.transactionDetails?.bankName,
            branchName: receiptData.transactionDetails?.branchName,
          },
        },
      },
      numberToWords,
      user: receiptData.user,
    });

    // Remove any existing print script from the content
    const contentWithoutPrintScript = receiptContent.replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    );

    // Write the content to the iframe
    printFrame.contentDocument.write(contentWithoutPrintScript);
    printFrame.contentDocument.close();

    // Force the print dialog to appear immediately
    printFrame.onload = () => {
      try {
        printFrame.contentWindow.print();
        onConfirmPrint();
      } catch (error) {
        console.error("Print failed:", error);
      } finally {
        // Remove the iframe after a short delay
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 500);
      }
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "900px",
          height: "68vh",
          paddingTop: "30px",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingBottom: "0px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{ marginBottom: "10px", fontSize: "18px", fontWeight: 400 }}
          >
            Receipt Preview
          </h2>
          <button
            style={{
              border: "none",
              background: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div style={{ margin: "0 auto", width: "80%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <span>
              Receipt No:{" "}
              <span style={{ fontWeight: 500 }}>
                {receiptData.uniqueNo} / {receiptData.receiptNumber}
              </span>
            </span>
            <span>
              Date:{" "}
              {new Date(receiptData.date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .split("/")
                .join("/")}
            </span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontWeight: 300,
                  marginRight: "10px",
                  color: "#696969",
                }}
              >
                Received With Thanks From
              </span>
              <span style={{ fontWeight: 500, color: "#666" }}>
                {receiptData.donorName}
              </span>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p
                style={{
                  margin: "5px 0 0 220px",
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                {receiptData.address?.flatNo}
              </p>
              <p
                style={{
                  margin: "5px 0 0 220px",
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                PO: {receiptData.address?.postOffice}, Dist:{" "}
                {receiptData.address?.district}
              </p>
              <p
                style={{
                  margin: "5px 0 0 220px",
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                State: {receiptData.address?.state}, Pin:{" "}
                {receiptData.address?.pincode}
              </p>
              <p
                style={{
                  margin: "5px 0 0 220px",
                  fontWeight: 500,
                  color: "#666",
                }}
              >
                {receiptData.identityType}: {receiptData.identityNumber}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontWeight: 300,
                  marginRight: "10px",
                  color: "#696969",
                }}
              >
                The Sum of Rupees:
              </span>
              <span style={{ color: "#666", fontWeight: 500 }}>
                {numberToWords(parseFloat(receiptData.amount))} Only
              </span>
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              <span
                style={{
                  fontWeight: 300,
                  marginRight: "5px",
                  color: "#696969",
                }}
              >
                By
              </span>
              <div style={{ color: "#666" }}>
                <div>
                  <span style={{ color: "#696969", fontWeight: 300 }}>
                    {receiptData.transactionType}
                  </span>{" "}
                  &nbsp;&nbsp;
                  {["Cheque", "DD", "Bank Transfer"].includes(
                    receiptData.transactionType
                  ) && (
                    <>
                      <span
                        style={{
                          fontWeight: 300,
                          color: "#696969",
                          marginRight: "5px",
                        }}
                      >
                        No.
                      </span>
                      <span style={{ color: "#696969", fontWeight: 300 }}>
                        {receiptData.transactionDetails?.transactionId}
                      </span>{" "}
                      &nbsp;&nbsp;{" "}
                      <span
                        style={{
                          fontWeight: 300,
                          color: "#696969",
                          marginRight: "5px",
                        }}
                      >
                        Dt.
                      </span>
                      <span style={{ color: "#696969", fontWeight: 300 }}>
                        {new Date(receiptData.transactionDetails?.date)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .split("/")
                          .join("-")}
                      </span>
                      {(receiptData.transactionDetails?.bankName ||
                        receiptData.transactionDetails?.branchName) && (
                        <div>
                          <span
                            style={{
                              fontWeight: 300,
                              color: "#696969",
                              marginRight: "5px",
                              marginLeft: "-25px",
                            }}
                          >
                            On
                          </span>
                          <span style={{ color: "#696969", fontWeight: 300 }}>
                            {receiptData.transactionDetails?.bankName}
                            {receiptData.transactionDetails?.branchName &&
                              `, ${receiptData.transactionDetails.branchName}`}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontWeight: 300,
                  marginRight: "10px",
                  color: "#696969",
                }}
              >
                As Donation for:
              </span>
              <span style={{ color: "#696969", fontWeight: 300 }}>
                {receiptData.donationType}
                {receiptData.purpose && ` for ${receiptData.purpose}`}
              </span>
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: "400",
                textAlign: "left",
                marginTop: "20px",
              }}
            >
              <span>₹ {receiptData.amount}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#f4811e",
                color: "white",
                cursor: "pointer",
              }}
              onClick={handlePrint}
            >
              Confirm Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;
