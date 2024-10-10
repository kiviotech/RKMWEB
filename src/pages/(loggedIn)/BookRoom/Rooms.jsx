// import React, { useState } from "react";
// import "./Rooms.scss";
// import { icons } from "../../../constants";

// const Rooms = () => {
//     const [selectedGuestHouse, setSelectedGuestHouse] = useState(1);
//     const [selectedFloor, setSelectedFloor] = useState(1);

//     const rooms = ["Gh-00", "Gh-01", "Gh-02", "Gh-03", "Gh-04", "Gh-05", "Gh-06"];
//     const dates = [
//         "1st Jul",
//         "2nd Jul",
//         "3rd Jul",
//         "4th Jul",
//         "5th Jul",
//         "6th Jul",
//         "7th Jul",
//     ];

//     return (
//         <div className="calendar-container">
//             <div className="grid">
//                 <div className="grid-header">
//                     {rooms.map((room, index) => (
//                         <div key={index} className="room-header">
//                             {room}
//                         </div>
//                     ))}
//                 </div>

//                 <div className="grid-body">
//                     {dates.map((date, index) => (
//                         <div key={index} className="date-row">
//                             <div className="date-label">{date}</div>
//                             {rooms.map((room, idx) => (
//                                 <div className="room-container">
//                                     <div key={idx} className="room-slot">
//                                         <img
//                                             src={icons.bed}
//                                             alt="bed"
//                                         />
//                                         <img
//                                             src={icons.bookedBed}
//                                             alt="bed"
//                                         />
                                    
//                                          <img
//                                             src={icons.bedSelected}
//                                             alt="bed"
//                                         />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Rooms;

import React, { useState } from "react";
import "./Rooms.scss";
import { icons } from "../../../constants";

const Rooms = ({ updateSelectedBedsCount }) => {
    const [rooms] = useState(["Gh-00", "Gh-01", "Gh-02", "Gh-03", "Gh-04", "Gh-05", "Gh-06"]);
    const [dates] = useState([
        "1st Jul", "2nd Jul", "3rd Jul", "4th Jul", "5th Jul", "6th Jul", "7th Jul",
    ]);

    const [bedStates, setBedStates] = useState(Array.from({ length: rooms.length }, () => 
        Array.from({ length: dates.length }, () => Array(3).fill("normal"))
    ));

    const handleBedClick = (roomIndex, dateIndex, bedIndex) => {
        const currentState = bedStates[roomIndex][dateIndex][bedIndex];

        // Prevent selecting a booked bed
        if (currentState === "booked") return;

        const newState = currentState === "normal" ? "selected" : "normal"; // Toggle between normal and selected

        setBedStates(prevStates => {
            const newStates = [...prevStates];
            newStates[roomIndex][dateIndex][bedIndex] = newState;
            updateSelectedBedsCount(newStates); // Update selected beds count in parent
            return newStates;
        });
    };

    return (
        <div className="calendar-container">
            <div className="grid">
                <div className="grid-header">
                    {rooms.map((room, index) => (
                        <div key={index} className="room-header">{room}</div>
                    ))}
                </div>

                <div className="grid-body">
                    {dates.map((date, dateIndex) => (
                        <div key={dateIndex} className="date-row">
                            <div className="date-label">{date}</div>
                            {rooms.map((room, roomIndex) => (
                                <div key={roomIndex} className="room-container">
                                    <div className="room-slot">
                                        {bedStates[roomIndex][dateIndex].map((state, bedIndex) => (
                                            <img
                                                key={bedIndex}
                                                src={state === "booked" ? icons.bookedBed : state === "selected" ? icons.bedSelected : icons.bed}
                                                alt={state === "booked" ? "booked bed" : state === "selected" ? "selected bed" : "normal bed"}
                                                onClick={() => handleBedClick(roomIndex, dateIndex, bedIndex)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Rooms;




