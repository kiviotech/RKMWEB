const Popup = ({ bedData, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Bed Details</h3>
        <p>Room Index: {bedData.roomIndex}</p>
        <p>Date Index: {bedData.dateIndex}</p>
        <p>Bed Index: {bedData.bedIndex}</p>
        <p>Bed Number: {bedData.bedNumber}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
