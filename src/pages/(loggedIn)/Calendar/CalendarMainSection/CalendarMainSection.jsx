import React, { useEffect, useState } from "react";
import "./CalendarMainSection.scss";
import { fetchCelebrationsByDateRange } from "../../../../../services/src/services/celebrationsService";

const CalendarMainSection = ({ currentDate, startDate, endDate }) => {
  const [celebrations, setCelebrations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Get calendar data
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Get last month's details
    const lastMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1
    );
    const daysInLastMonth = getDaysInMonth(lastMonth);

    // Add days from previous month
    for (let i = 0; i < firstDay; i++) {
      const day = daysInLastMonth - firstDay + i + 1;
      days.push(
        <div key={`prev-${i}`} className="calendar-day empty">
          <div className="day-number text-gray-400 self-start">{day}</div>
        </div>
      );
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        day
      );
      const dayEvents = celebrations.filter(
        (celebration) =>
          new Date(celebration.attributes.gregorian_date).toDateString() ===
          currentDay.toDateString()
      );

      // Check if the day is today
      const today = new Date();
      const isToday = currentDay.toDateString() === today.toDateString();

      days.push(
        <div key={day} className={`calendar-day ${isToday ? "today" : ""}`}>
          <div
            className={`day-number self-start ${isToday ? "today-number" : ""}`}
            style={
              isToday
                ? {
                    backgroundColor: "#4F46E5", // Indigo color
                    color: "white",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                  }
                : undefined
            }
          >
            {day}
          </div>
          <div className="events-container">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`event ${event.attributes.event_type.toLowerCase()}`}
                style={{
                  backgroundColor:
                    event.attributes.event_type.toLowerCase() === "birthday"
                      ? "#fcdd81"
                      : event.attributes.event_type.toLowerCase() === "ekadashi"
                      ? "#07d2ff"
                      : "#8df1c7",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  margin: "2px 0",
                  fontSize: "13px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div className="event-title">{event.attributes.event_name}</div>
                <div className="hindu-date">{event.attributes.hindu_date}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Add days from next month
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - (firstDay + daysInMonth);

    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="calendar-day empty">
          <div className="day-number text-gray-400">{i}</div>
        </div>
      );
    }

    return days;
  };

  // Fetch celebrations when date range changes
  useEffect(() => {
    const fetchCelebrations = async () => {
      setIsLoading(true);
      try {
        const startDateStr = startDate?.toISOString().split("T")[0];
        const endDateStr = endDate?.toISOString().split("T")[0];
        const response = await fetchCelebrationsByDateRange(
          startDateStr,
          endDateStr
        );
        if (response?.data) {
          setCelebrations(response.data);
        }
      } catch (error) {
        console.error("Error fetching celebrations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchCelebrations();
    }
  }, [startDate, endDate]);

  // Update selected date when currentDate changes
  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="calendar-grid">{generateCalendarDays()}</div>
      )}
    </div>
  );
};

export default CalendarMainSection;
