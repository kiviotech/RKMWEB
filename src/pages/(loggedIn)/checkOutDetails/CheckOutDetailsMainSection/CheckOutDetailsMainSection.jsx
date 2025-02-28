import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  fetchRoomAllocationsForCheckin,
  updateRoomAllocationStatus,
} from "../../../../../services/src/services/roomAllocationService";
import {
  sendAllReminders,
  sendReminderEmail,
  sendReminderSMS,
} from "../../../../../services/src/services/reminderService";
import icons from "../../../../constants/icons";

const CheckOutDetailsMainSection = ({ selectedDate }) => {
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const dropdownRef = React.useRef(null);
  const [allocations, setAllocations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAllocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetchRoomAllocationsForCheckin(
          "departure_date",
          selectedDate
        );
        setAllocations(response.data || []);
      } catch (error) {
        console.error("Error fetching room allocations:", error);
        setAllocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllocations();
  }, [selectedDate]);

  const handleStatusUpdate = async (allocationId, newStatus) => {
    try {
      await updateRoomAllocationStatus(allocationId, newStatus);
      setAllocations(
        allocations.map((allocation) => {
          if (allocation.id === allocationId) {
            return {
              ...allocation,
              attributes: {
                ...allocation.attributes,
                status: newStatus,
              },
            };
          }
          return allocation;
        })
      );
      toast.success(`Guest status updated to ${newStatus}`);
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update guest status");
    }
  };

  const handleMoreClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleSendAllNotifications = async (allocation) => {
    try {
      const reminderData = {
        data: {
          bookingId: allocation.id,
          name: allocation.attributes.guests.data[0]?.attributes?.name || "",
          email: allocation.attributes.guests.data[0]?.attributes?.email || "",
          checkoutDate: new Date(
            allocation.attributes.guests.data[0]?.attributes?.departure_date
          )
            .toISOString()
            .split("T")[0],
          roomNumber: allocation.attributes.room.data.attributes.room_number,
        },
      };

      await sendAllReminders(reminderData);
      toast.success("Reminder notifications sent successfully!");
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error sending reminder notifications:", error);
      toast.error("Failed to send reminder notifications");
    }
  };

  const handleSendEmail = async (allocation) => {
    try {
      const emailData = {
        bookingId: allocation.id,
        name: allocation.attributes.guests.data[0]?.attributes?.name || "",
        email: allocation.attributes.guests.data[0]?.attributes?.email || "",
        phoneNumber:
          allocation.attributes.guests.data[0]?.attributes?.phone_number || "",
        checkoutDate: new Date(
          allocation.attributes.guests.data[0]?.attributes?.departure_date
        )
          .toISOString()
          .split("T")[0],
        roomNumber: allocation.attributes.room.data.attributes.room_number,
      };

      await sendReminderEmail(emailData);
      toast.success("Reminder email sent successfully!");
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error sending reminder email:", error);
      toast.error("Failed to send reminder email");
    }
  };

  const handleSendSMS = async (allocation) => {
    try {
      const smsData = {
        bookingId: allocation.id,
        name: allocation.attributes.guests.data[0]?.attributes?.name || "",
        email: allocation.attributes.guests.data[0]?.attributes?.email || "",
        phoneNumber:
          allocation.attributes.guests.data[0]?.attributes?.phone_number || "",
        checkoutDate: new Date(
          allocation.attributes.guests.data[0]?.attributes?.departure_date
        )
          .toISOString()
          .split("T")[0],
        roomNumber: allocation.attributes.room.data.attributes.room_number,
      };

      await sendReminderSMS(smsData);
      toast.success("Reminder SMS sent successfully!");
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error sending reminder SMS:", error);
      toast.error("Failed to send reminder SMS");
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="check-in-details">
      <table className="check-in-table">
        <thead>
          <tr>
            <th>Room number</th>
            <th>Guest Name</th>
            <th>Arrival date</th>
            <th>No. of Guests</th>
            <th>Stay Duration</th>
            <th>Donation</th>
            <th>Donation Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9">
                <div className="loader-container">
                  <div className="loader"></div>
                </div>
              </td>
            </tr>
          ) : Array.isArray(allocations) && allocations.length > 0 ? (
            allocations.map((allocation, index) => {
              // Calculate stay duration
              const arrivalDate = new Date(
                allocation.attributes.guests.data[0]?.attributes?.arrival_date
              );
              const departureDate = new Date(
                allocation.attributes.guests.data[0]?.attributes?.departure_date
              );
              const stayDuration =
                departureDate && arrivalDate
                  ? Math.ceil(
                      (departureDate - arrivalDate) / (1000 * 60 * 60 * 24)
                    )
                  : "N/A";
              return (
                <tr key={index}>
                  <td>
                    {allocation.attributes.room.data.attributes.room_number}
                  </td>
                  <td>
                    {allocation.attributes.guests.data[0]?.attributes?.name ||
                      "N/A"}
                  </td>
                  <td>
                    {allocation.attributes.guests.data[0]?.attributes
                      ?.arrival_date
                      ? new Date(
                          allocation.attributes.guests.data[0].attributes.departure_date
                        )
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .split("/")
                          .join("-")
                      : "N/A"}
                  </td>
                  <td>{allocation.attributes.guests.data?.length || 0}</td>
                  <td>
                    {stayDuration} {stayDuration !== "N/A" ? "days" : ""}
                  </td>
                  <td
                    style={{
                      color:
                        allocation.attributes.donation === "Not yet donated"
                          ? "red"
                          : "green",
                    }}
                  >
                    {allocation.attributes.donation}
                  </td>
                  <td>₹{allocation.attributes.donationAmount || 0}</td>
                  <td className="actions">
                    <div className="dropdown-container" ref={dropdownRef}>
                      <button
                        className="more-btn"
                        onClick={() => handleMoreClick(index)}
                      >
                        ⋮
                      </button>
                      {activeDropdown === index && (
                        <div className="dropdown-menus">
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleSendAllNotifications(allocation)
                            }
                          >
                            <img src={icons.notification2} alt="" />
                            Send all notifications
                          </button>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item">
                            <img src={icons.whatsapp2} alt="" />
                            Send Whatsapp
                          </button>
                          <div className="dropdown-divider"></div>
                          <button
                            className="dropdown-item"
                            onClick={() => handleSendEmail(allocation)}
                          >
                            <img src={icons.mail} alt="" />
                            Send an E-mail
                          </button>
                          <div className="dropdown-divider"></div>
                          <button
                            className="dropdown-item"
                            onClick={() => handleSendSMS(allocation)}
                          >
                            <img src={icons.message} alt="" />
                            Send SMS
                          </button>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item">
                            <img src={icons.call} alt="" />
                            Call the Guest
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No allocations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckOutDetailsMainSection;
