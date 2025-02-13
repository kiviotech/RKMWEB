import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import YesIcon from "../../../assets/icons/YesIcon.png";
import NoIcon from "../../../assets/icons/NoIcon.png";
import Yes1Icon from "../../../assets/icons/Yes1Icon.png";
import No1Icon from "../../../assets/icons/No1Icon.png";
import useDeekshaFormStore from "../../../../deekshaFormStore";
import "./DeekshaBooksForm.scss";

const translations = {
  english: {
    booksQuestion:
      "What books have you read on Sri Ramakrishna, Sri Sarada Devi and Swami Vivekananda?",
    enterBook: "Enter the book name",
    addBook: "+ Add another book",
    japaQuestion:
      "If initiated, will you be able to do Japa and Meditation regularly?",
    disabilityQuestion: "Do you have any physical/mental disability?",
    hearingQuestion: "Can you hear well?",
    yes: "Yes",
    no: "No",
    back: "Back",
    next: "Next",
  },
  hindi: {
    booksQuestion:
      "आपने श्री रामकृष्ण, श्री सारदा देवी और स्वामी विवेकानंद पर कौन सी पुस्तकें पढ़ी हैं?",
    enterBook: "पुस्तक का नाम दर्ज करें",
    addBook: "+ एक और पुस्तक जोड़ें",
    japaQuestion:
      "यदि दीक्षित हुए, तो क्या आप नियमित रूप से जप और ध्यान कर पाएंगे?",
    disabilityQuestion: "क्या आपको कोई शारीरिक/मानसिक विकलांगता है?",
    hearingQuestion: "क्या आप अच्छी तरह सुन सकते हैं?",
    yes: "हाँ",
    no: "नहीं",
    back: "वापस",
    next: "अगला",
  },
  bengali: {
    booksQuestion:
      "আপনি শ্রী রামকৃষ্ণ, শ্রী সারদা দেবী এবং স্বামী বিবেকানন্দের উপর কী কী বই পড়েছেন?",
    enterBook: "বইয়ের নাম লিখুন",
    addBook: "+ আরও একটি বই যোগ করুন",
    japaQuestion: "দীক্ষিত হলে, আপনি কি নিয়মিত জপ ও ধ্যান করতে পারবেন?",
    disabilityQuestion: "আপনার কি কোনো শারীরিক/মানসিক প্রতিবন্ধকতা আছে?",
    hearingQuestion: "আপনি কি ভালোভাবে শুনতে পান?",
    yes: "হ্যাঁ",
    no: "না",
    back: "পিছনে",
    next: "পরবর্তী",
  },
};

const DeekshaBooksForm = () => {
  const navigate = useNavigate();
  const { books, updateBooks, formLanguage, guruji } = useDeekshaFormStore();

  // Get translations based on selected language
  const t = translations[formLanguage || "english"];

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
      hearing,
    });
    // Console log entire store state
    // console.log("Current Deeksha Form State:", useDeekshaFormStore.getState());
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

      <h1 className="deekshabooks-heading">{guruji}</h1>

      <p className="deekshabooks-question">{t.booksQuestion}</p>

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
            placeholder={t.enterBook}
          />
          {index === 0 && errors.books && (
            <span className="error-message">{errors.books}</span>
          )}
        </div>
      ))}

      <p className="deekshabooks-add-book" onClick={addBookField}>
        {t.addBook}
      </p>

      <div className="deekshabooks-formgroup">
        <p className="deekshabooks-question">{t.japaQuestion}</p>
        <div className="deekshabooks-icon-container">
          <button
            onClick={() => {
              handleSelection("japaMeditation", "yes");
              setErrors({ ...errors, japaMeditation: null });
            }}
          >
            <img
              src={japaMeditation === "yes" ? YesIcon : Yes1Icon}
              alt={t.yes}
              className="deekshabooks-icon"
            />
          </button>
          <button
            onClick={() => {
              handleSelection("japaMeditation", "no");
              setErrors({ ...errors, japaMeditation: null });
            }}
          >
            <img
              src={japaMeditation === "no" ? No1Icon : NoIcon}
              alt={t.no}
              className="deekshabooks-icon"
            />
          </button>
        </div>
        {errors.japaMeditation && (
          <span className="error-message">{errors.japaMeditation}</span>
        )}
      </div>

      <div className="deekshabooks-formgroup">
        <p className="deekshabooks-question">{t.disabilityQuestion}</p>
        <div className="deekshabooks-icon-container">
          <button
            onClick={() => {
              handleSelection("disability", "yes");
              setErrors({ ...errors, disability: null });
            }}
          >
            <img
              src={disability === "yes" ? YesIcon : Yes1Icon}
              alt={t.yes}
              className="deekshabooks-icon"
            />
          </button>
          <button
            onClick={() => {
              handleSelection("disability", "no");
              setErrors({ ...errors, disability: null });
            }}
          >
            <img
              src={disability === "no" ? No1Icon : NoIcon}
              alt={t.no}
              className="deekshabooks-icon"
            />
          </button>
        </div>
        {errors.disability && (
          <span className="error-message">{errors.disability}</span>
        )}
      </div>

      <div className="deekshabooks-formgroup">
        <p className="deekshabooks-question">{t.hearingQuestion}</p>
        <div className="deekshabooks-icon-container">
          <button
            onClick={() => {
              handleSelection("hearing", "yes");
              setErrors({ ...errors, hearing: null });
            }}
          >
            <img
              src={hearing === "yes" ? YesIcon : Yes1Icon}
              alt={t.yes}
              className="deekshabooks-icon"
            />
          </button>
          <button
            onClick={() => {
              handleSelection("hearing", "no");
              setErrors({ ...errors, hearing: null });
            }}
          >
            <img
              src={hearing === "no" ? No1Icon : NoIcon}
              alt={t.no}
              className="deekshabooks-icon"
            />
          </button>
        </div>
        {errors.hearing && (
          <span className="error-message">{errors.hearing}</span>
        )}
      </div>

      <div className="deekshabooks-button-container">
        <button onClick={handleBack} className="deekshabooksform-back-button">
          {t.back}
        </button>
        <button onClick={handleNext} className="deekshabooksform-next-button">
          {t.next}
        </button>
      </div>
    </div>
  );
};

export default DeekshaBooksForm;
