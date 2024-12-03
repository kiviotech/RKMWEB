// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import YesIcon from "../../../assets/icons/YesIcon.png";
// import NoIcon from "../../../assets/icons/NoIcon.png";
// import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
// import No1Icon from "../../../assets/icons/No1Icon.png";
// import useDeekshaFormStore from "../../../../deekshaFormStore"

// const DeekshaBooksForm = () => {
//   const navigate = useNavigate();
//   const { books, updateBooks } = useDeekshaFormStore();
  
//   // Initialize state from Zustand store
//   const [bookList, setBookList] = useState(books.bookList || [""]);
//   const [japaMeditation, setJapaMeditation] = useState(books.japaMeditation);
//   const [disability, setDisability] = useState(books.disability);
//   const [hearing, setHearing] = useState(books.hearing);
//   const [isBackClicked, setBackClicked] = useState(false);

//   // Update Zustand store whenever form values change
//   useEffect(() => {
//     updateBooks({
//       bookList,
//       japaMeditation,
//       disability,
//       hearing
//     });
//     // Console log entire store state
//     console.log("Current Deeksha Form State:", useDeekshaFormStore.getState());
//   }, [bookList, japaMeditation, disability, hearing, updateBooks]);

//   // Add another book
//   const addBookField = () => setBookList([...bookList, ""]);

//   // Update book input
//   const updateBook = (index, value) => {
//     const updatedBooks = [...bookList];
//     updatedBooks[index] = value;
//     setBookList(updatedBooks);
//   };

//   // Back button functionality
//   const handleBack = () => {
//     setBackClicked(true);
//     setTimeout(() => {
//       navigate("/deekshaDuration-form");
//     }, 200);
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Lexend" }}>
//       {/* Progress Bar */}
//       <div style={{
//         width: "100%",
//         height: "8px",
//         background: "#E0E0E0",
//         borderRadius: "4px",
//         marginBottom: "20px",
//       }}>
//         <div style={{
//           width: "87.5%", // 7/8 steps
//           height: "100%",
//           background: "#9867E9",
//           borderRadius: "4px",
//         }}></div>
//       </div>

//       {/* Heading */}
//       <h1
//         style={{
//           fontFamily: "Lexend",
//           fontSize: "32px",
//           fontWeight: "600",
//           lineHeight: "40px",
//           textAlign: "center",
//           color: "#9867E9",
//         }}
//       >
//         Srimat Swami Gautamanandaji Maharaj’s Diksha Form
//       </h1>

//       {/* Question: What books */}
//       <p
//         style={{
//           fontFamily: "Lexend",
//           fontSize: "24px",
//           fontWeight: "500",
//           lineHeight: "30px",
//           textAlign: "left",
//           margin: "30px 0 10px 0",
//         }}
//       >
//         What books have you read on Sri Ramakrishna, Sri Sarada Devi and Swami
//         Vivekananda?
//       </p>

//       {/* Book Input Fields */}
//       {bookList.map((book, index) => (
//         <input
//           key={index}
//           type="text"
//           value={book}
//           onChange={(e) => updateBook(index, e.target.value)}
//           placeholder="Enter the book name"
//           style={{
//             width: "705px",
//             height: "56px",
//             padding: "10px 20px",
//             marginBottom: "10px",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//           }}
//         />
//       ))}

//       <p
//         onClick={addBookField}
//         style={{
//           fontFamily: "Lexend",
//           fontSize: "16px",
//           fontWeight: "500",
//           lineHeight: "30px",
//           color: "#9867E9",
//           cursor: "pointer",
//         }}
//       >
//         + Add another book
//       </p>

//       {/* Question: Japa and Meditation */}
//       <p
//         style={{
//           fontFamily: "Lexend",
//           fontSize: "24px",
//           fontWeight: "500",
//           lineHeight: "30px",
//           margin: "20px 0 10px 0",
//         }}
//       >
//         If initiated, will you be able to do Japa and Meditation regularly?
//       </p>
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//         <img
//           src={japaMeditation === "yes" ? YesIcon : Yes1Icon}
//           alt="Yes"
//           onClick={() => setJapaMeditation("yes")}
//           style={{ width: "50px", height: "50px", cursor: "pointer" }}
//         />
//         <img
//           src={japaMeditation === "no" ? NoIcon : No1Icon}
//           alt="No"
//           onClick={() => setJapaMeditation("no")}
//           style={{ width: "50px", height: "50px", cursor: "pointer" }}
//         />
//       </div>

//       {/* Question: Physical/Mental Disability */}
//       <p
//         style={{
//           fontFamily: "Lexend",
//           fontSize: "24px",
//           fontWeight: "500",
//           lineHeight: "30px",
//           margin: "20px 0 10px 0",
//         }}
//       >
//         Do you have any physical/mental disability?
//       </p>
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//         <img
//           src={disability === "yes" ? YesIcon : Yes1Icon}
//           alt="Yes"
//           onClick={() => setDisability("yes")}
//           style={{ width: "50px", height: "50px", cursor: "pointer" }}
//         />
//         <img
//           src={disability === "no" ? NoIcon : No1Icon}
//           alt="No"
//           onClick={() => setDisability("no")}
//           style={{ width: "50px", height: "50px", cursor: "pointer" }}
//         />
//       </div>

//       {/* Question: Hearing */}
//       <p
//         style={{
//           fontFamily: "Lexend",
//           fontSize: "24px",
//           fontWeight: "500",
//           lineHeight: "30px",
//           margin: "20px 0 10px 0",
//         }}
//       >
//         Can you hear well?
//       </p>
//       <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
//         <img
//           src={hearing === "yes" ? YesIcon : Yes1Icon}
//           alt="Yes"
//           onClick={() => setHearing("yes")}
//           style={{ width: "50px", height: "50px", cursor: "pointer" }}
//         />
//         <img
//           src={hearing === "no" ? NoIcon : No1Icon}
//           alt="No"
//           onClick={() => setHearing("no")}
//           style={{ width: "50px", height: "50px", cursor: "pointer" }}
//         />
//       </div>

//       {/* Back and Next Buttons */}
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <button
//           onClick={handleBack}
//           style={{
//             padding: "12px 25px",
//             borderRadius: "5px",
//             border: "none",
//             background: isBackClicked ? "#9867E9" : "#e0e0e0", // Change color on click
//             color: isBackClicked ? "#fff" : "#000",
//             cursor: "pointer",
//             fontSize: "16px",
//           }}
//         >
//           Back
//         </button>

//         <Link
//           to="/deekshaUpasana-form"
//           style={{
//             padding: "12px 25px",
//             borderRadius: "5px",
//             border: "none",
//             background: "#9A4EFC",
//             color: "#fff",
//             cursor: "pointer",
//             fontSize: "16px",
//             textDecoration: "none",
//             display: "inline-block",
//           }}
//         >
//           Next
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DeekshaBooksForm;




import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore"
import "./DeekshaBooksForm.scss"

const DeekshaBooksForm = () => {
  const navigate = useNavigate();
  const { books, updateBooks } = useDeekshaFormStore();

  // Initialize state from Zustand store
  const [bookList, setBookList] = useState(books.bookList || [""]);
  const [japaMeditation, setJapaMeditation] = useState(books.japaMeditation);
  const [disability, setDisability] = useState(books.disability);
  const [hearing, setHearing] = useState(books.hearing);
  const [isBackClicked, setBackClicked] = useState(false);

  // Update Zustand store whenever form values change
  useEffect(() => {
    updateBooks({
      bookList,
      japaMeditation,
      disability,
      hearing
    });
    // Console log entire store state
    console.log("Current Deeksha Form State:", useDeekshaFormStore.getState());
  }, [bookList, japaMeditation, disability, hearing, updateBooks]);

  // Add another book
  const addBookField = () => setBookList([...bookList, ""]);

  // Update book input
  const updateBook = (index, value) => {
    const updatedBooks = [...bookList];
    updatedBooks[index] = value;
    setBookList(updatedBooks);
  };

  // Back button functionality
  const handleBack = () => {
    setBackClicked(true);
    setTimeout(() => {
      navigate("/deekshaDuration-form");
    }, 200);
  };

  return (
    <div className="deekshabooks-form-container">
      <div className="deekshabooks-progress-bar">
        <div className="deekshabooks-progress-bar-inner"></div>
      </div>

      <h1 className="deekshabooks-heading">
        Srimat Swami Gautamanandaji Maharaj’s Diksha Form
      </h1>

      <p className="deekshabooks-question">
        What books have you read on Sri Ramakrishna, Sri Sarada Devi and Swami Vivekananda?
      </p>

      {bookList.map((book, index) => (
        <input
          key={index}
          className="deekshabooks-input-field"
          type="text"
          value={book}
          onChange={(e) => updateBook(index, e.target.value)}
          placeholder="Enter the book name"
        />
      ))}

      <p className="deekshabooks-add-book" onClick={addBookField}>
        + Add another book
      </p>

      <div className="deekshabooks-formgroup">


        <p className="deekshabooks-question">
          If initiated, will you be able to do Japa and Meditation regularly?
        </p>
        <div className="deekshabooks-icon-container">
         <button>
         <img
            src={japaMeditation === "yes" ? YesIcon : Yes1Icon}
            alt="Yes"
            onClick={() => setJapaMeditation("yes")}
            className="deekshabooks-icon"
          />
         </button>
          <button>
          <img
            src={japaMeditation === "no" ? NoIcon : No1Icon}
            alt="No"
            onClick={() => setJapaMeditation("no")}
            className="deekshabooks-icon"
          />
          </button>
        </div>

      </div>


      <div className="deekshabooks-formgroup">


        <p className="deekshabooks-question">
        Do you have any physical/mental disability??
        </p>
        <div className="deekshabooks-icon-container">
          <button>
          <img
            src={japaMeditation === "yes" ? YesIcon : Yes1Icon}
            alt="Yes"
            onClick={() => setJapaMeditation("yes")}
            className="deekshabooks-icon"
          />
          </button>
         <button>
         <img
            src={japaMeditation === "no" ? NoIcon : No1Icon}
            alt="No"
            onClick={() => setJapaMeditation("no")}
            className="deekshabooks-icon"
          />
         </button>
        </div>

      </div>


      <div className="deekshabooks-formgroup">


        <p className="deekshabooks-question">
        Can you hear well??
        </p>
        <div className="deekshabooks-icon-container">
         <button>
         <img
            src={japaMeditation === "yes" ? YesIcon : Yes1Icon}
            alt="Yes"
            onClick={() => setJapaMeditation("yes")}
            className="deekshabooks-icon"
          />
         </button>
        <button>
        <img
            src={japaMeditation === "no" ? No1Icon : NoIcon}
            alt="Yes"
            onClick={() => setJapaMeditation("yes")}
            className="deekshabooks-icon"
          />
        </button>
        </div>

      </div>



      

      <div className="deekshabooks-button-container">
        <button
          onClick={handleBack}
          className="deekshabooksform-back-button"
        >
          Back
        </button>

        <Link
          to="/deekshaUpasana-form"
         className="deekshabooksform-next-button"
        >
          Next
        </Link>
      </div>
    </div>

  );
};

export default DeekshaBooksForm;