import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarMainSection from "./CalendarMainSection/CalendarMainSection";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Calculate start and end dates for the current month
  const getMonthRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };
  //

  const { start: startDate, end: endDate } = getMonthRange(currentDate);

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateToPrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const navigateToNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleEventAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <ToastContainer />
      <CalendarHeader
        currentDate={currentDate}
        startDate={startDate}
        endDate={endDate}
        onToday={navigateToToday}
        onPrev={navigateToPrev}
        onNext={navigateToNext}
        onEventAdded={handleEventAdded}
      />
      <CalendarMainSection
        currentDate={currentDate}
        startDate={startDate}
        endDate={endDate}
        key={refreshTrigger}
      />
    </>
  );
};

export default Calendar;
