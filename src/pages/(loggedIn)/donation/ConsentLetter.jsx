import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ConsentLetter = () => {
  const location = useLocation();
  const donationData = location.state?.donationData;

  useEffect(() => {
    if (donationData) {
      // Auto-print when component mounts
      window.print();
    }
  }, [donationData]);

  // Format date to DD-MMM-YY
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  // Format amount in words
  const numberToWords = (num) => {
    if (!num) return "";

    const ones = [
      "",
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
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
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

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";

      let result = "";

      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
        if (n > 0) result += "and ";
      }

      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + " ";
        return result;
      }

      if (n > 0) {
        result += ones[n] + " ";
      }

      return result;
    };

    if (num === 0) return "Zero";

    const numStr = num.toString();
    if (numStr.length > 9) return "Number too large";

    const crores = Math.floor(num / 10000000);
    const lakhs = Math.floor((num % 10000000) / 100000);
    const thousands = Math.floor((num % 100000) / 1000);
    const remaining = num % 1000;

    let result = "";

    if (crores > 0) {
      result += convertLessThanThousand(crores) + "Crore ";
    }
    if (lakhs > 0) {
      result += convertLessThanThousand(lakhs) + "Lakh ";
    }
    if (thousands > 0) {
      result += convertLessThanThousand(thousands) + "Thousand ";
    }
    if (remaining > 0) {
      result += convertLessThanThousand(remaining);
    }

    return result.trim();
  };

  return (
    <div
      className="consent-letter"
      style={{ padding: "5px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
        CONSENT LETTER
      </h2>

      <div style={{ marginBottom: "5px" }}>
        <p>Date: {formatDate(donationData?.donationDate || new Date())}</p>
        <p>ID NO: {donationData?.uniqueDonorId || ""}</p>
      </div>

      <div style={{ marginBottom: "5px" }}>
        <p>To</p>
        <p>The Adhyaksha</p>
        <p>Ramakrishna Math</p>
        <p>Vill. & P.O.: Kamarpukur</p>
        <p>Dist.: Hooghly, West Bengal, Pin - 712 612</p>
      </div>

      <p>Revered Maharaj,</p>

      <p style={{ marginTop: "5px" }}>
        I am donating a sum of Rs. {donationData?.amount}/- (
        {numberToWords(donationData?.amount)} only) by{" "}
        {donationData?.transactionType || "Cash"} as{" "}
        {donationData?.donationType || "Others(Revenue)"} for{" "}
        {donationData?.purpose || "Thakur Seva"}.
      </p>

      <p>Please accept and oblige.</p>

      <p>With pranams,</p>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <p>Yours sincerely,</p>
      </div>

      <div style={{ marginTop: "5px" }}>
        <p>
          {donationData?.title} {donationData?.name}
        </p>
        <p>
          Vill: {donationData?.houseNumber}, {donationData?.streetName}
        </p>
        <p>
          PO: {donationData?.postOffice}, Dist: {donationData?.district}
        </p>
        <p>
          State: {donationData?.state}, Pin: {donationData?.pincode}
        </p>
        <p>
          PAN: {donationData?.panNumber}, Mobile No.: {donationData?.phone}
        </p>
        {donationData?.inMemoryOf && (
          <p>In Memory of {donationData?.inMemoryOf}.</p>
        )}
      </div>

      <div
        style={{
          marginTop: "10px",
          borderTop: "1px solid #000",
          paddingTop: "5px",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "3px" }}>
          FOR OFFICE USE ONLY
        </h3>
        <p>
          Receipt No.: {donationData?.receiptNumber}, dated{" "}
          {formatDate(donationData?.donationDate || new Date())}
        </p>
        <p>By {donationData?.transactionType || "Cash"}</p>
        <p>Issued by hand / Send by Post</p>
      </div>
    </div>
  );
};

export default ConsentLetter;
