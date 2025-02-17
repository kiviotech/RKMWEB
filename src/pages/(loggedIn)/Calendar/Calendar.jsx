import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarMainSection from "./CalendarMainSection/CalendarMainSection";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <>
      <CalendarHeader
        currentDate={currentDate}
        onToday={navigateToToday}
        onPrev={navigateToPrev}
        onNext={navigateToNext}
      />
      <CalendarMainSection currentDate={currentDate} />
    </>
  );
};

export default Calendar;
