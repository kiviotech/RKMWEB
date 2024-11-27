import React from "react";
import icons from "../../../constants/icons";
import CommonButton from "../../../components/ui/Button";


const GuestDetailsPopup = ({ isOpen, onClose, guestDetails }) => {
    if (!isOpen) return null;

   
    const guestData = [
        { name: "Mrs. John Dee", age: 35, gender: "F", invite: "Yes" },
        { name: "Mr. Ajay Kumar", age: 48, gender: "M", invite: "No" },
        { name: "Mrs. John Dee", age: 35, gender: "F", invite: "Yes" },
        { name: "Mrs. John Dee", age: 35, gender: "F", invite: "Yes" },
        { name: "Mr. Ajay Kumar", age: 48, gender: "M", invite: "No" },
        { name: "Mrs. John Dee", age: 35, gender: "F", invite: "Yes" },
    ];

    const visitData = [
        { date: "20/11/2024", days: 5, room: "GH-101", donation: "₹100.00" },
        { date: "15/10/2024", days: 3, room: "GH-102", donation: "₹200.00" },
        { date: "20/11/2024", days: 5, room: "GH-101", donation: "₹100.00" },
        { date: "15/10/2024", days: 3, room: "GH-102", donation: "₹200.00" },
    ];

    return (
        <div style={styles.overlay}>
            <div style={styles.container}>
                <button style={styles.closeButton} onClick={onClose}>
                    &times;
                </button>

                {/* Header Section */}
                <div style={styles.header}>
                    {/* Left Section */}
                    <div style={styles.leftSection}>
                        <div style={styles.profileImage}>
                             A
                        </div>
                        <div style={styles.guestInfo}>
                        <h2 style={styles.headerText}>Mr. John Dee</h2>

                            <div style={styles.guestInfoTop}>

                           
                                <p style={styles.headerSubText}>
                                  <strong>Age :</strong> <span style={styles.values}> 24</span>
                                </p>
                                <p style={styles.headerSubText}>
                                   <strong>Gender :</strong>
                                   <span style={styles.values}> M</span>
                                </p>
                                <p style={styles.headerSubText}>
                                    <img src={icons.Email} style={styles.icons}></img>
                                    <span style={styles.values}> johndee@gmail.com</span>
                                </p>
                                <p style={styles.headerSubText}>
                                <img src={icons.Contact} style={styles.icons}></img>
                                <span style={styles.values}>  +910000000000</span>
                                
                                </p>

                            </div>


                           <div style={styles.guestInfoTop}>

                           <p style={styles.headerSubText}>
                               <strong>Occupation :</strong> 
                               <span style={styles.values}>   software engineer</span>
                              
                            </p>
                            <p style={styles.headerSubText}>
                                <strong>Aadhar no :- </strong>
                                <span style={styles.values}>   **** **** **** 0000</span>
                                </p>

                           </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div style={styles.rightSection}>
                        <p><strong>Stay Duration:</strong> 3 days</p>
                        <div style={styles.dateSection}>
                            <p style={styles.headerSubText}>
                            <img src={icons.Calendar} style={styles.icons}/>
                            <strong style={styles.dateColor}>Arrival Date:</strong><span>00/00/0000</span>
                            </p>
                            <p style={styles.headerSubText}>
                                <img src={icons.Calendar} style={styles.icons}/>
                            <strong style={styles.dateColor}> Departure Date:</strong><span>00/00/0000</span>
                            </p>
                        </div>
                    </div>
                </div>

             
              

                {/* Body */}
                <div style={styles.body}>
                    {/* Guests Section */}
                    <div style={styles.guestsSection}>
                        <h3>Guests</h3>
                        <div style={{ maxHeight: "150px", overflowY: "auto",  }}>
                        <table style={{ ...styles.table, borderSpacing: "0" }}>
        <thead>
            <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Age</th>
                <th style={styles.tableHeader}>Gender</th>
                <th style={styles.tableHeader}>Initiation</th>
            </tr>
        </thead>
        <tbody>
            {guestData.map((guest, index) => (
                <tr
                    key={index}
                    style={{
                        backgroundColor: "#d3d3d3", // Gray background
                        borderRadius: "8px",
                        overflow: "hidden",
                        transition: "background-color 0.3s ease", // Smooth transition
                        marginBottom:'10px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffc0cb"; // Pink on hover
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#d3d3d3"; // Back to gray
                    }}
                >
                    <td style={{ ...styles.tableCell, padding: "10px 15px" }}>{guest.name}</td>
                    <td style={{ ...styles.tableCell, padding: "10px 15px" }}>{guest.age}</td>
                    <td style={{ ...styles.tableCell, padding: "10px 15px" }}>{guest.gender}</td>
                    <td style={{ ...styles.tableCell, padding: "10px 15px" }}>{guest.invite}</td>
                </tr>
            ))}
        </tbody>
    </table>
        </div>
                    </div>
                 

                    {/* Visit History Section */}
                    <div style={styles.historySection}>
                        <h3>Visit History of John Dee</h3>
                        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Last Visited Date</th>
                        <th style={styles.tableHeader}>Number of Days</th>
                        <th style={styles.tableHeader}>Room Allocated</th>
                        <th style={styles.tableHeader}>Donations</th>
                    </tr>
                </thead>
                <tbody>
                    {visitData.map((visit, index) => (
                        <tr key={index}>
                            <td style={styles.tableCell}>{visit.date}</td>
                            <td style={styles.tableCell}>{visit.days}</td>
                            <td style={styles.tableCell}>{visit.room}</td>
                            <td style={styles.tableCell}>{visit.donation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
                    </div>
                </div>
               <div  style={styles.footer}>

               <div style={styles.alert}>Alert - There is a revisit within 6 months</div>
               
               <div style={styles.buttons}>
                            <CommonButton
                                // onClick={(e) => handleStatusChange(e, request.id, "approved")}
                                buttonName="Approve"
                                buttonWidth="28%"
                                style={{
                                    backgroundColor: "#ECF8DB",
                                    color: "#A3D65C",
                                    borderColor: "#A3D65C",
                                    fontSize: "14px",
                                    borderRadius: "7px",
                                    borderWidth: 1,
                                    // padding: "8px 20px",
                                }}
                            />

                            <CommonButton
                                // onClick={(e) => handleStatusChange(e, request.id, "on_hold")}
                                buttonName="Put on Hold"
                                buttonWidth="60%"
                                style={{
                                    backgroundColor: "#FFF4B2",
                                    color: "#F2900D",
                                    borderColor: "#F2900D",
                                    fontSize: "14px",
                                    borderRadius: "7px",
                                    borderWidth: 1,
                                }}
                            />

                            <CommonButton
                                // onClick={(e) => handleStatusChange(e, request.id, "rejected")}
                                buttonName="Reject"
                                buttonWidth="28%"
                                style={{
                                    backgroundColor: "#FFBDCB",
                                    color: "#FC5275",
                                    borderColor: "#FC5275",
                                    fontSize: "14px",
                                    borderRadius: "7px",
                                    borderWidth: 1,
                                    // padding: "8px 20px",
                                }}
                            />
                        </div>

               </div>
            </div>
        </div>
    );
};

export default GuestDetailsPopup;








const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    container: {
        width: "89%", // Set the width to a larger percentage (or px if you prefer)
        
        background: "#fff",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
        top: "-50px", // Move the container up
        left: "50px", // Move the container to the right
    },

    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "transparent",
        border: "none",
        fontSize: "1.5em",
        cursor: "pointer",
        color: "#555",
    },
    header: {
        borderBottom: "2px solid #ddd",
        paddingBottom: "15px",
        marginBottom: "15px",
        display: "flex",
        justifyContent: 'center',
        alignItems: 'ceneter',
        gap: '20%'
        
    },
    leftSection: {
        display: "flex",
        alignItems: "flex-start",
    },
    profileImage: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#d43f3a',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '36px',
        fontWeight: 'bold',
        marginRight: '16px',
        marginTop:'10px'
    },
    guestInfo: {
        marginLeft: '10px',
    },
    guestInfoTop: {
        display: 'flex',
        flexDirection: 'row',
        gap:'15px'
    },
    icons:{
        marginRight:'5px'
    },
    headerText: {
        margin: 0,
        color: "#000",
        fontSize: "1.5em",
    },
    headerSubText: {
        margin: "5px 0",
        color: "#000",
    },
    values:{
        color: '#4B4B4B',

        
    },
    
    dateSection:{
        display:'flex',
        flexDirection:'column'

    },
    dateColor:{
        color:' #9867E9',

    },
    stayInfo: {
        marginTop: "10px",
    },
    body: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
    },
    guestsSection: {
        flex: 1,
    },
    historySection: {
        flex: 1,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
    },
    tableHeader: {
        backgroundColor: "#f4f4f4",
        color: "#333",
        textAlign: "left",
        padding: "10px",
    },
    tableCell: {
        border: "1px solid #ddd",
        padding: "10px",
        textAlign: "left",
    },
    alert: {
        color: "red",
        marginBottom: "10px",
        fontWeight: "bold",
    },
    buttons: {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'flex-end',
        gap: 10,
        height: 25,
        width: 700,
        // margin-top: 0;
      }
};