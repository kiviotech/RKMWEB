import React, { useState, useRef, useEffect } from "react";
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
    gregorian_date_from: "",
    gregorian_date_to: "",
    event_type: "",
    event_name: "",
  });
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
  const eventTypeRef = useRef(null);
  const [eventNameError, setEventNameError] = useState("");

  // Define event type options
  const eventTypeOptions = [
    "Birthday",
    "Puja",
    "Ekadashi",
  ];

  // Add click outside handler for event type dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventTypeRef.current && !eventTypeRef.current.contains(event.target)) {
        setIsEventTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Add validation for event_name
    if (name === "event_name") {
      // Only allow letters and hyphen
      if (!/^[A-Za-z\s-]*$/.test(value)) {
        setEventNameError("Event name can only contain letters and hyphens");
        return;
      } else {
        setEventNameError("");
      }
    }

    setFormData((prev) => {
      if (name === "gregorian_date_from") {
        // When from date changes, ensure to date is not before it
        return {
          ...prev,
          [name]: value,
          // Reset to date if it's before the new from date
          gregorian_date_to: prev.gregorian_date_to < value ? value : prev.gregorian_date_to,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fromDate = new Date(formData.gregorian_date_from);
      const toDate = new Date(formData.gregorian_date_to);

      // Split event_name if it contains "-"
      const [eventName, hinduDate] = formData.event_name.includes("-")
        ? formData.event_name.split("-").map((str) => str.trim())
        : [formData.event_name, null];

      // If dates are the same, create single celebration
      if (fromDate.getTime() === toDate.getTime()) {
        const data = {
          gregorian_date: formData.gregorian_date_from,
          event_type: formData.event_type,
          event_name: eventName,
          hindu_date: hinduDate, // Add hindu_date if it exists
        };
        await createNewCelebration({ data });
      } else {
        // Create celebrations for each day in the range
        const currentDate = new Date(fromDate);
        while (currentDate <= toDate) {
          const data = {
            gregorian_date: currentDate.toISOString().split("T")[0],
            event_type: formData.event_type,
            event_name: eventName,
            hindu_date: hinduDate, // Add hindu_date if it exists
          };
          await createNewCelebration({ data });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      setIsModalOpen(false);
      setFormData({
        gregorian_date_from: "",
        gregorian_date_to: "",
        event_type: "",
        event_name: "",
      });

      if (onEventAdded) {
        onEventAdded();
      }

      toast.success("Celebration(s) created successfully!", {
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

  // console.log("Calendar Range:", {
  //   start: startDate?.toISOString(),
  //   end: endDate?.toISOString(),
  // });

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
                <label>From Date</label>
                <input
                  type="date"
                  name="gregorian_date_from"
                  value={formData.gregorian_date_from}
                  onChange={handleInputChange}
                  min={today}
                  required
                />
              </div>
              <div className="athithi-form-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="gregorian_date_to"
                  value={formData.gregorian_date_to}
                  onChange={handleInputChange}
                  min={formData.gregorian_date_from || today}
                  required
                />
              </div>
              <div className="athithi-form-group">
                <label>Event Type</label>
                <div className="custom-select" ref={eventTypeRef}>
                  <div
                    className="selected-deeksha"
                    onClick={() => setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen)}
                    style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}
                  >
                    <span>{formData.event_type || "Select Event type"}</span>
                    <svg
                      className={`dropdown-icon ${isEventTypeDropdownOpen ? "open" : ""}`}
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {isEventTypeDropdownOpen && (
                    <div
                      className="deeksha-dropdown"
                      style={{ border: '1px solid #e0e0e0', marginTop: '4px' }}
                    >
                      <div className="deeksha-list">
                        {eventTypeOptions.map((option) => (
                          <div
                            key={option}
                            className="deeksha-option"
                            onClick={() => {
                              handleInputChange({
                                target: { name: "event_type", value: option },
                              });
                              setIsEventTypeDropdownOpen(false);
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="athithi-form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleInputChange}
                  placeholder="Enter the event name"
                  pattern="[A-Za-z\s-]+"
                  title="Event name can only contain letters and hyphens"
                  required
                />
                {eventNameError && (
                  <span className="error-message" style={{
                    color: 'red',
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'block'
                  }}>
                    {eventNameError}
                  </span>
                )}
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
