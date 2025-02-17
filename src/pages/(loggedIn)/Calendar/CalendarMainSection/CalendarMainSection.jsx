import React, { useEffect, useRef } from "react";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import "./CalendarMainSection.scss";

const CalendarMainSection = ({ currentDate }) => {
  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);

  // Convert your events to Toast UI Calendar format
  const formattedEvents = [
    {
      id: "1",
      calendarId: "religious",
      title: "Swami Trigunatitananda Magha Shukla Chaturthi",
      category: "allday",
      start: "2025-02-02",
      end: "2025-02-02",
      backgroundColor: "#a8e6cf", // Light green for religious events
    },
    {
      id: "2",
      calendarId: "cultural",
      title: "Sri Sri Saraswati Puja Magha Shukla Panchami",
      category: "allday",
      start: "2025-02-02",
      end: "2025-02-02",
      backgroundColor: "#ffd3b6", // Light orange for cultural events
    },
    // ... convert other events similarly
  ];

  useEffect(() => {
    if (!calendarRef.current) return;

    calendarInstance.current = new Calendar(calendarRef.current, {
      defaultView: "month",
      usageStatistics: false,
      isReadOnly: true,
      month: {
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        startDayOfWeek: 1,
      },
      calendars: [
        {
          id: "religious",
          name: "Religious Events",
          color: "#000000",
          backgroundColor: "#a8e6cf",
        },
        {
          id: "cultural",
          name: "Cultural Events",
          color: "#000000",
          backgroundColor: "#ffd3b6",
        },
        {
          id: "ekadashi",
          name: "Ekadashi",
          color: "#000000",
          backgroundColor: "#00d8ff",
        },
      ],
    });

    calendarInstance.current.createEvents(formattedEvents);

    return () => {
      calendarInstance.current.destroy();
    };
  }, []);

  // Update calendar when currentDate changes
  useEffect(() => {
    if (calendarInstance.current) {
      calendarInstance.current.setDate(currentDate);
    }
  }, [currentDate]);

  return <div ref={calendarRef} style={{ height: "800px" }} />;
};

export default CalendarMainSection;
