import React from "react";
import "./CheckInDetailsMainSection.scss";
import {
  fetchRoomAllocationsForCheckin,
  updateRoomAllocationStatus,
} from "../../../../../services/src/services/roomAllocationService";
import { toast } from "react-toastify";

const CheckInDetailsMainSection = ({ selectedDate }) => {
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const dropdownRef = React.useRef(null);
  const [allocations, setAllocations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAllocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetchRoomAllocationsForCheckin(
          "arrival_date",
          selectedDate
        );
        setAllocations(response.data || []);
        console.log("Room allocations for", selectedDate, ":", response.data);
      } catch (error) {
        console.error("Error fetching room allocations:", error);
        setAllocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllocations();
  }, [selectedDate]);

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

  const handleMoreClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleStatusUpdate = async (allocationId, newStatus) => {
    try {
      await updateRoomAllocationStatus(allocationId, newStatus);

      // Update the local state to reflect the change
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

      // Show success toast
      toast.success(`Guest status updated to ${newStatus}`);

      // Close the dropdown
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error updating status:", error);
      // Show error toast
      toast.error("Failed to update guest status");
    }
  };

  // You can now use selectedDate to filter your table data
  console.log("Selected date:", selectedDate);

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
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7">
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
                          allocation.attributes.guests.data[0].attributes.arrival_date
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
                  <td>
                    <span
                      className={`status ${(
                        allocation.attributes.status || "pending"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {allocation.attributes.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="scan-btn">
                      <span className="scan-icon">
                        <svg
                          fill="#fff"
                          width="15px"
                          height="15px"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          data-name="Layer 1"
                        >
                          <path d="M8,21H4a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H8a1,1,0,0,0,0-2Zm14-6a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H16a1,1,0,0,0,0,2h4a3,3,0,0,0,3-3V16A1,1,0,0,0,22,15ZM20,1H16a1,1,0,0,0,0,2h4a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V4A3,3,0,0,0,20,1ZM2,9A1,1,0,0,0,3,8V4A1,1,0,0,1,4,3H8A1,1,0,0,0,8,1H4A3,3,0,0,0,1,4V8A1,1,0,0,0,2,9Zm8-4H6A1,1,0,0,0,5,6v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V6A1,1,0,0,0,10,5ZM9,9H7V7H9Zm5,2h4a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H14a1,1,0,0,0-1,1v4A1,1,0,0,0,14,11Zm1-4h2V9H15Zm-5,6H6a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,17H7V15H9Zm5-1a1,1,0,0,0,1-1,1,1,0,0,0,0-2H14a1,1,0,0,0-1,1v1A1,1,0,0,0,14,16Zm4-3a1,1,0,0,0-1,1v3a1,1,0,0,0,0,2h1a1,1,0,0,0,1-1V14A1,1,0,0,0,18,13Zm-4,4a1,1,0,1,0,1,1A1,1,0,0,0,14,17Z" />
                        </svg>
                      </span>
                      Scan
                    </button>
                    <div className="dropdown-container" ref={dropdownRef}>
                      <button
                        className="more-btn"
                        onClick={() => handleMoreClick(index)}
                      >
                        ⋮
                      </button>
                      {activeDropdown === index && (
                        <div className="dropdown-menu">
                          <button
                            className="dropdown-item arrived"
                            onClick={() =>
                              handleStatusUpdate(allocation.id, "arrived")
                            }
                          >
                            <span className="check-icon">✔️</span>
                            Mark as Arrived
                          </button>
                          <button
                            className="dropdown-item not-arrived"
                            onClick={() =>
                              handleStatusUpdate(allocation.id, "not arrived")
                            }
                          >
                            <span className="cross-icon">❌</span>
                            Mark as Not Arrived
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
              <td colSpan="7" style={{ textAlign: "center" }}>
                No allocations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckInDetailsMainSection;
