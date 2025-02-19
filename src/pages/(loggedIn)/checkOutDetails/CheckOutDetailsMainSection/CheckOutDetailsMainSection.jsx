import React from "react";
import icons from "../../../../constants/icons";

const CheckOutDetailsMainSection = () => {
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
      donation: "Not yet donated",
      donationAmount: "3000",
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
            <th>Donation</th>
            <th>Donation Amount</th>
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
              <td
                style={{
                  color: row.donation === "Not yet donated" ? "red" : "green",
                }}
              >
                {row.donation}
              </td>
              <td>₹{row.donationAmount}</td>
              <td className="actions">
                <div className="dropdown-container" ref={dropdownRef}>
                  <button
                    className="more-btn"
                    onClick={() => handleMoreClick(index)}
                  >
                    ⋮
                  </button>
                  {activeDropdown === index && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item">
                        <img src={icons.notification2} alt="" />
                        Send all notifications
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item">
                        <img src={icons.whatsapp2} alt="" />
                        Send Whatsapp
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item">
                        <img src={icons.mail} alt="" />
                        Send an E-mail
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item">
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheckOutDetailsMainSection;
