// import React, { useState, useEffect } from "react";
// import "./RejectionEmailPopup.scss";

// const RejectionEmailPopup = ({ onClose, onSubmit, guestDetail }) => {
//   // console.log("guest data is",guestDetail.guests)

//   const [selectedReasons, setSelectedReasons] = useState([]);
//   const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
//   const [emailContent, setEmailContent] = useState("");

//   const reasons = ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5"];

//   // Example of dynamic dates, replace with your actual logic
//   const arrivalDate = guestDetail.userDetails.arrivalDate;
//   const departureDate = guestDetail.userDetails.departureDate;

//   const handleCheckboxChange = (reason) => {
//     setSelectedReasons((prev) =>
//       prev.includes(reason)
//         ? prev.filter((r) => r !== reason)
//         : [...prev, reason]
//     );
//   };

//   const handleSubmit = () => {
//     if (selectedReasons.length === 0) {
//       alert("Please select at least one reason.");
//       return;
//     }

//     // Generate the email content based on the selected reasons
//     let content = `Dear Devotee,\n\nNamoskar,\n\nWe have received the below email and noted the contents. You are welcome to stay at our Guest House during the mentioned period i.e arrival - ${arrivalDate} and departure - ${departureDate} \n`;

//     content += `\nPlease bring a hard copy of this letter for ready reference along with your ID Proof or copy of your ID Proof (Aadhaar/ PAN/ Voter Card/Passport). Also, try to reach the Math Office to do the registration formalities between 09.00 to 11.00 a.m. on the day of arrival.\n\nMay Sri Ramakrishna, Holy Mother Sri Sarada Devi, and Swami Vivekananda bless you all!\n\nPranam and namaskar again.\n\nYours sincerely,\n\nSwami Lokahanananda`;

//     setEmailContent(content);
//     setIsEmailModalOpen(true); // Open the email modal
//   };

//   const handleSendEmail = () => {
//     try {
//       // Call the onSubmit prop function to simulate sending the email
//       onSubmit(selectedReasons);
//       setIsEmailModalOpen(false); // Close the email modal after sending
//       alert("Email sent successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Error sending email:", error);
//       alert("Failed to send email and allocate rooms. Please try again.");
//     }
//   };

//   // Email Modal Component
//   const ConfirmationEmailModal = ({
//     isOpen,
//     onClose,
//     emailContent,
//     onSend,
//     guestDetail,
//     arrivalDate,
//     departureDate,
//   }) => {
//     console.log("only guest data is", guestDetail.guests[1].name);
//     if (!isOpen) return null;

//     return (
//       <div className="confirmation-email-overlay">
//         <div className="confirmation-email-content">
//           <div className="email-template">
//             {/* Email Header */}
//             <div className="email-header">
//               <span className="close-button" onClick={onClose}>
//                 ×
//               </span>
//               <div className="email-fields">
//                 <div className="field">
//                   <span>From:</span>
//                   <span className="email-address">emailaddress@gmail.com</span>
//                 </div>
//                 <div className="field">
//                   <span>To:</span>
//                   <div className="recipient-tags">
//                     {guestDetail?.guests?.map((guest, index) => (
//                       <div key={index} className="recipient-chip">
//                         <div className="avatar">A</div>
//                         <span className="name">{guest.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Email Content */}
//             <div className="email-content">
//               <textarea
//                 value={emailContent}
//                 onChange={(e) => setEmailContent(e.target.value)}
//                 className="email-content-textarea"
//               />
//             </div>

//             {/* Email Footer */}
//             <div className="email-footer">
//               <button onClick={onClose} className="cancel-button">
//                 Cancel
//               </button>
//               <button onClick={onSend} className="send-button">
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="attithi-rejection-overlay">
//       <div className="attithi-rejection-content">
//         <button className="attithi-rejection-close" onClick={onClose}>
//           x
//         </button>
//         <h3 className="attithi-rejection-title">
//           Select the reason to add in the rejection email
//         </h3>
//         <div className="attithi-rejection-reasons">
//           {reasons.map((reason, index) => (
//             <label key={index} className="attithi-rejection-option">
//               <input
//                 type="checkbox"
//                 checked={selectedReasons.includes(reason)}
//                 onChange={() => handleCheckboxChange(reason)}
//                 className="attithi-rejection-checkbox"
//               />
//               {reason}
//             </label>
//           ))}
//         </div>
//         <div className="attithi-rejection-actions">
//           <button
//             className="attithi-rejection-send"
//             onClick={handleSubmit}
//             disabled={selectedReasons.length === 0}
//           >
//             Send Mail
//           </button>
//           <button className="attithi-rejection-cancel" onClick={onClose}>
//             Cancel
//           </button>
//         </div>
//       </div>

//       {/* Render ConfirmationEmailModal */}
//       <ConfirmationEmailModal
//         isOpen={isEmailModalOpen}
//         onClose={() => setIsEmailModalOpen(false)}
//         emailContent={emailContent}
//         onSend={handleSendEmail}
//         guestDetail={guestDetail}
//       />
//     </div>
//   );
// };

// export default RejectionEmailPopup;

import React, { useState, useEffect } from "react";
import "./RejectionEmailPopup.scss";

const RejectionEmailPopup = ({ onClose, onSubmit, guestDetail }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState("");

  const reasons = ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Reason 5"];

  const arrivalDate = guestDetail.userDetails.arrivalDate;
  const departureDate = guestDetail.userDetails.departureDate;

  const handleCheckboxChange = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (selectedReasons.length === 0) {
      alert("Please select at least one reason.");
      return;
    }

    // Generate the email content based on the selected reasons
    let content = `Dear Devotee,

Namoskar,

We have received the below email and noted the contents. You are welcome to stay at our Guest House during the mentioned period i.e arrival - ${arrivalDate} and departure - ${departureDate}

Please bring a hard copy of this letter for ready reference along with your ID Proof or copy of your ID Proof (Aadhaar/ PAN/ Voter Card/Passport). Also, try to reach the Math Office to do the registration formalities between 09.00 to 11.00 a.m. on the day of arrival.

May Sri Ramakrishna, Holy Mother Sri Sarada Devi, and Swami Vivekananda bless you all!

Pranam and namaskar again.

Yours sincerely,
Swami Lokahanananda`;

    setEmailContent(content);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = () => {
    try {
      onSubmit(selectedReasons);
      setIsEmailModalOpen(false);
      alert("Email sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email and allocate rooms. Please try again.");
    }
  };

  const ConfirmationEmailModal = ({
    isOpen,
    onClose,
    emailContent,
    onSend,
    guestDetail,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="confirmation-email-overlay">
        <div className="confirmation-email-content">
          <div className="email-template">
            <div className="email-header">
              <span className="close-button" onClick={onClose}>
                ×
              </span>
              <div className="email-fields">
                <div className="field">
                  <span>From:</span>
                  <span className="email-address">emailaddress@gmail.com</span>
                </div>
                <div className="field">
                  <span>To:</span>
                  <div className="recipient-tags">
                    {guestDetail?.guests?.map((guest, index) => (
                      <div key={index} className="recipient-chip">
                        <div className="avatar">A</div>
                        <span className="name">{guest.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="email-content">
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="email-content-textarea"
              />
            </div>

            <div className="email-footer">
              <button onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button onClick={onSend} className="send-button">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="attithi-rejection-overlay">
      <div className="attithi-rejection-content">
        <button className="attithi-rejection-close" onClick={onClose}>
          x
        </button>
        <h3 className="attithi-rejection-title">
          Select the reason to add in the rejection email
        </h3>
        <div className="attithi-rejection-reasons">
          {reasons.map((reason, index) => (
            <label key={index} className="attithi-rejection-option">
              <input
                type="checkbox"
                checked={selectedReasons.includes(reason)}
                onChange={() => handleCheckboxChange(reason)}
                className="attithi-rejection-checkbox"
              />
              {reason}
            </label>
          ))}
        </div>
        <div className="attithi-rejection-actions">
          <button
            className="attithi-rejection-send"
            onClick={handleSubmit}
            disabled={selectedReasons.length === 0}
          >
            Send Mail
          </button>
          <button className="attithi-rejection-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <ConfirmationEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailContent={emailContent}
        onSend={handleSendEmail}
        guestDetail={guestDetail}
      />
    </div>
  );
};

export default RejectionEmailPopup;
