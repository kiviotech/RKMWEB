import React, { useState } from "react";
import { toast } from "react-toastify";
import "./CalendarHeader.scss";
import { createNewCelebration } from "../../../../../services/src/services/celebrationsService";

const CalendarHeader = ({
  currentDate,
  startDate,
  endDate,
  onToday,
  onPrev,
  onNext,
  onEventAdded,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gregorian_date: "",
    event_type: "",
    event_name: "",
    hindu_date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        gregorian_date: formData.gregorian_date,
        event_type: formData.event_type,
        event_name: formData.event_name,
        hindu_date: formData.hindu_date,
      };

      await createNewCelebration({ data });
      setIsModalOpen(false);
      setFormData({
        gregorian_date: "",
        event_type: "",
        event_name: "",
        hindu_date: "",
      });

      if (onEventAdded) {
        onEventAdded();
      }

      toast.success("Celebration created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Failed to create celebration:", error);
      toast.error("Failed to create celebration. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  console.log("Calendar Range:", {
    start: startDate?.toISOString(),
    end: endDate?.toISOString(),
  });

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
            style={{ backgroundColor: "#8df1c7" }}
          ></span>
          <span>Religious Events</span>
        </div>
        <div className="calendar-legend-item">
          <span
            className="calendar-legend-dot"
            style={{ backgroundColor: "#fcdd81" }}
          ></span>
          <span>Cultural Events</span>
        </div>
        <div className="calendar-legend-item">
          <span
            className="calendar-legend-dot"
            style={{ backgroundColor: "#07d2ff" }}
          ></span>
          <span>Ekadashi Days</span>
        </div>
      </div>

      <button
        className="calendar-add-event-button"
        onClick={() => setIsModalOpen(true)}
      >
        + Add Event
      </button>

      {isModalOpen && (
        <div className="athithi-modal-backdrop">
          <div className="athithi-modal">
            <div className="athithi-modal__header">
              <h2>Add Event</h2>
              <button
                className="athithi-modal__close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="athithi-modal__body">
              <div className="athithi-form-group">
                <label>Gregorian Date</label>
                <input
                  type="date"
                  name="gregorian_date"
                  value={formData.gregorian_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="athithi-form-group">
                <label>Event Type</label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Event type</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Puja">Puja</option>
                  <option value="Ekadashi">Ekadashi</option>
                </select>
              </div>
              <div className="athithi-form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleInputChange}
                  placeholder="Enter the event name"
                  required
                />
              </div>
              <div className="athithi-form-group">
                <label>Hindu Date</label>
                <input
                  type="text"
                  name="hindu_date"
                  value={formData.hindu_date}
                  onChange={handleInputChange}
                  placeholder="Enter Hindu date"
                  required
                />
              </div>
              <button type="submit" className="athithi-modal__submit-btn">
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarHeader;
