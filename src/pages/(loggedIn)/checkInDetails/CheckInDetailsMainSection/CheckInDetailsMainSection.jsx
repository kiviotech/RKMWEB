import React from "react";
import "./CheckInDetailsMainSection.scss";

const CheckInDetailsMainSection = () => {
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const dropdownRef = React.useRef(null);

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

  const tableData = [
    {
      roomNumber: "GH-101",
      guestName: "Mr. John Doe",
      arrivalDate: "00/00/0000",
      noOfGuests: 5,
      stayDuration: "3 days",
      status: "Arrived",
    },
    // Add more data as needed
  ];

  const handleMoreClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="check-in-details">
      <table className="check-in-table">
        <thead>
          <tr>
            <th>Room number</th>
            <th>Guest Name</th>
            <th>Arrival date</th>
            <th>No. of Guets</th>
            <th>Stay Duration</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.roomNumber}</td>
              <td>{row.guestName}</td>
              <td>{row.arrivalDate}</td>
              <td>{row.noOfGuests}</td>
              <td>{row.stayDuration}</td>
              <td>
                <span className={`status ${row.status.toLowerCase()}`}>
                  {row.status}
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
                      <button className="dropdown-item arrived">
                        <span className="check-icon">✔️</span>
                        Mark as Arrived
                      </button>
                      <button className="dropdown-item not-arrived">
                        <span className="cross-icon">❌</span>
                        Mark as Not Arrived
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckInDetailsMainSection;
