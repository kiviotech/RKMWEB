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

   // Change 1: Update toggle logic for Yes/No button selection
  const handleSelection = (field, value) => {
    switch (field) {
      case "japaMeditation":
        setJapaMeditation((prev) => (prev === value ? null : value));
        break;
        
      case "disability":
        setDisability((prev) => (prev === value ? null : value));
        break;
      case "hearing":
        setHearing((prev) => (prev === value ? null : value));
        break;
    }
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
         <button onClick={() => handleSelection("japaMeditation", "yes")}>
         <img
            src={japaMeditation === "yes" ? YesIcon : Yes1Icon}
            alt="Yes"
            // onClick={() => setJapaMeditation("yes")}
            className="deekshabooks-icon"
          />
         </button>
          <button onClick={() => handleSelection("japaMeditation", "no")}>
          <img
            src={japaMeditation === "no" ? No1Icon : NoIcon}
            alt="No"
            // onClick={() => setJapaMeditation("no")}
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

          <button onClick={() => handleSelection("disability", "yes")}>
          <img
            src={disability === "yes" ? YesIcon : Yes1Icon}
            alt="Yes"
            //onClick={() => handleSelection("disability", "yes")}
            className="deekshabooks-icon"
          />
          </button>
         <button onClick={() => handleSelection("disability", "no")}>
         <img
            src={disability === "no" ? No1Icon : NoIcon}
            alt="No"
            //onClick={() => setJapaMeditation("no")}
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
         <button onClick={() => handleSelection("hearing", "yes")}>
         <img
            src={hearing === "yes" ? YesIcon : Yes1Icon}
            alt="Yes"
            //onClick={() => setJapaMeditation("yes")}
            className="deekshabooks-icon"
          />
         </button>
        <button onClick={() => handleSelection("hearing", "no")}>
        <img
            src={hearing === "no" ? No1Icon : NoIcon}
            alt="No"
           // onClick={() => setJapaMeditation("yes")}
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