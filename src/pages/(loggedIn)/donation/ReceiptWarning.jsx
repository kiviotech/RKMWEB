import React from 'react'
import CommonButton from "../../../components/ui/Button"
import { icons } from '../../../constants'

const ReceiptWarning = ({ closePopup }) => {
  return (
    <div className="popup_overlay">
          <div className="popup_content">
            <img src={icons.warning} alt="warning" />
            <h3>Are you sure you want to reject this guest?</h3>
            <p>
              Once confirmed, the action will be final and cannot be undone. An
              email will be sent to inform them about the rejection.
            </p>
            <div className="popup_actions">
              <CommonButton
                buttonName="Cancel"
                style={{
                  backgroundColor: "#FFF",
                  color: "#4B4B4B",
                  borderColor: "#4B4B4B",
                  fontSize: "18px",
                  borderRadius: "7px",
                  borderWidth: 1,
                  padding: "8px 20px",
                }}
                onClick={closePopup} 
              />
              <CommonButton
                buttonName=" Void "
                style={{
                  backgroundColor: "#FFBDCB",
                  color: "#FC5275",
                  borderColor: "#FC5275",
                }}
                onClick={() => {
                    console.log('Receipt editing confirmed');
                    closePopup();  // Close popup after confirming
                  }}
              />
            </div>
          </div>
        </div>
  )
}

export default ReceiptWarning