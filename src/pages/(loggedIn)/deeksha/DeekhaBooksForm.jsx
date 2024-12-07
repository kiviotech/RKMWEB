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
  const [errors, setErrors] = useState({});

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

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate at least one book is entered
    if (!bookList[0]?.trim()) {
      newErrors.books = "Please enter at least one book";
    }

    // Validate Japa Meditation selection
    if (!japaMeditation) {
      newErrors.japaMeditation = "Please select Yes or No";
    }

    // Validate Disability selection
    if (!disability) {
      newErrors.disability = "Please select Yes or No";
    }

    // Validate Hearing selection
    if (!hearing) {
      newErrors.hearing = "Please select Yes or No";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next button click
  const handleNext = (e) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (isValid) {
      navigate("/deekshaUpasana-form");
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
        <div key={index}>
          <input
            className="deekshabooks-input-field"
            type="text"
            value={book}
            onChange={(e) => {
              updateBook(index, e.target.value);
              if (e.target.value.trim()) {
                setErrors({ ...errors, books: null });
              }
            }}
            placeholder="Enter the book name"
          />
          {index === 0 && errors.books && (
            <span className="error-message">{errors.books}</span>
          )}
        </div>
      ))}

      <p className="deekshabooks-add-book" onClick={addBookField}>
        + Add another book
      </p>

      <div className="deekshabooks-formgroup">
        <p className="deekshabooks-question">
          If initiated, will you be able to do Japa and Meditation regularly?
        </p>
        <div className="deekshabooks-icon-container">
          <button onClick={() => {
            handleSelection("japaMeditation", "yes");
            setErrors({ ...errors, japaMeditation: null });
          }}>
            <img
              src={japaMeditation === "yes" ? YesIcon : Yes1Icon}
              alt="Yes"
              className="deekshabooks-icon"
            />
          </button>
          <button onClick={() => {
            handleSelection("japaMeditation", "no");
            setErrors({ ...errors, japaMeditation: null });
          }}>
            <img
              src={japaMeditation === "no" ? No1Icon : NoIcon}
              alt="No"
              className="deekshabooks-icon"
            />
          </button>
        </div>
        {errors.japaMeditation && (
          <span className="error-message">{errors.japaMeditation}</span>
        )}
      </div>

      <div className="deekshabooks-formgroup">
        <p className="deekshabooks-question">
          Do you have any physical/mental disability?
        </p>
        <div className="deekshabooks-icon-container">
          <button onClick={() => {
            handleSelection("disability", "yes");
            setErrors({ ...errors, disability: null });
          }}>
            <img
              src={disability === "yes" ? YesIcon : Yes1Icon}
              alt="Yes"
              className="deekshabooks-icon"
            />
          </button>
          <button onClick={() => {
            handleSelection("disability", "no");
            setErrors({ ...errors, disability: null });
          }}>
            <img
              src={disability === "no" ? No1Icon : NoIcon}
              alt="No"
              className="deekshabooks-icon"
            />
          </button>
        </div>
        {errors.disability && (
          <span className="error-message">{errors.disability}</span>
        )}
      </div>

      <div className="deekshabooks-formgroup">
        <p className="deekshabooks-question">
          Can you hear well?
        </p>
        <div className="deekshabooks-icon-container">
          <button onClick={() => {
            handleSelection("hearing", "yes");
            setErrors({ ...errors, hearing: null });
          }}>
            <img
              src={hearing === "yes" ? YesIcon : Yes1Icon}
              alt="Yes"
              className="deekshabooks-icon"
            />
          </button>
          <button onClick={() => {
            handleSelection("hearing", "no");
            setErrors({ ...errors, hearing: null });
          }}>
            <img
              src={hearing === "no" ? No1Icon : NoIcon}
              alt="No"
              className="deekshabooks-icon"
            />
          </button>
        </div>
        {errors.hearing && (
          <span className="error-message">{errors.hearing}</span>
        )}
      </div>

      <div className="deekshabooks-button-container">
        <button
          onClick={handleBack}
          className="deekshabooksform-back-button"
        >
          Back
        </button>
        <button 
          onClick={handleNext}
          className="deekshabooksform-next-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeekshaBooksForm;