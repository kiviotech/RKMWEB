import React from "react";
import "./CalendarHeader.scss";

const CalendarHeader = ({ currentDate, onToday, onPrev, onNext }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="calendar-header-container">
      <h2>{formatDate(currentDate)}</h2>
      <div className="calendar-navigation-section">
        <button className="calendar-nav-button" onClick={onPrev}>
          &lt;
        </button>
        <button onClick={onToday}>Today</button>
        <button className="calendar-nav-button" onClick={onNext}>
          &gt;
        </button>
      </div>

      <div className="calendar-event-legend">
        <div className="calendar-legend-item">
          <span
            className="calendar-legend-dot"
            style={{ backgroundColor: "#a8e6cf" }}
          ></span>
          <span>Religious Events</span>
        </div>
        <div className="calendar-legend-item">
          <span
            className="calendar-legend-dot"
            style={{ backgroundColor: "#ffd3b6" }}
          ></span>
          <span>Cultural Events</span>
        </div>
        <div className="calendar-legend-item">
          <span
            className="calendar-legend-dot"
            style={{ backgroundColor: "#00d8ff" }}
          ></span>
          <span>Ekadashi Days</span>
        </div>
      </div>

      <button className="calendar-add-event-button">+ Add Event</button>
    </div>
  );
};

export default CalendarHeader;
