import React, { useState, useEffect } from "react";
import CheckInDetailsHeader from "./CheckInDetailsHeader/CheckInDetailsHeader";
import CheckInDetailsMainSection from "./CheckInDetailsMainSection/CheckInDetailsMainSection";

const CheckInDetails = () => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  // Format date to yyyy-mm-dd
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    setSelectedDate(formatDate(new Date()));
  }, []);

  const handleTabChange = (tab) => {
    if (tab === "today") {
      setSelectedDate(formatDate(new Date()));
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(formatDate(tomorrow));
    }
  };

  return (
    <div>
      <CheckInDetailsHeader onTabChange={handleTabChange} />
      <CheckInDetailsMainSection selectedDate={selectedDate} />
    </div>
  );
};

export default CheckInDetails;
