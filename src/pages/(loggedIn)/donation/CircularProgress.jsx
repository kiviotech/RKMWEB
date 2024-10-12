// import React from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import "./CircularProgress.scss";

// const CircularProgress = ({ donated, totalDonations, yetToDonate, progressColor, remainingColor }) => {
//   const percentageDonated = (donated / totalDonations) * 100;
// //   console.log(totalDonations)

//   return (
//     <div className="guest-donation-status">
//       <h2>Current Guest Donation Status</h2>
//       <div className="status-info">
//         <div className="status-circle">
//           <CircularProgressbar
//             value={percentageDonated}
//             text={`${Math.round(percentageDonated)}%`}
//             // text={`${Math.round(percentageDonated)}%`}
//             styles={buildStyles({
//               textColor: progressColor,
//               pathColor: progressColor,
//               trailColor: remainingColor, // The color for the 'yet to donate' part
//             })}
//           />
//         </div>
//         <div className="status-text">
//           <p>Donated {donated}/{totalDonations}</p>
//           <p>Yet to donate {yetToDonate}/{totalDonations}</p>
//         </div>
//       </div>
//       <button className="reminder-btn">Send Reminder</button>
//     </div>
//   );
// };

// export default CircularProgress;
import React from "react";
import "./CircularProgress.scss";
import { Link } from "react-router-dom";

const DonationStatus = () => {
  const totalGuests = 300;
  const donatedGuests = 230;
  const yetToDonate = totalGuests - donatedGuests;

  const donatedPercentage = (donatedGuests / totalGuests) * 100;
  const yetToDonatePercentage = 100 - donatedPercentage;

  return (
    <div className="donation-status">
      <h2>Current Guest Donation Status</h2>
      <div className="status-container">
        <div className="progress-ring">
          <svg viewBox="0 0 36 36">
            <path
              className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${donatedPercentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
        <div className="donation-details">
          <p>
            <span className="dot donated"></span> Donated{" "}
            <strong>
              {donatedGuests}/{totalGuests}
            </strong>
          </p>
          <p>
            <span className="dot yet-to-donate"></span> Yet to donate{" "}
            <strong>
              {yetToDonate}/{totalGuests}
            </strong>
          </p>
        </div>
        <button className="send-reminder">
          <span className="reminder-icon">🔔</span> Send Reminder
        </button>
      </div>
      <Link to="/donationdetail" className="view-more">
        View more &gt;
      </Link>
    </div>
  );
};

export default DonationStatus;
