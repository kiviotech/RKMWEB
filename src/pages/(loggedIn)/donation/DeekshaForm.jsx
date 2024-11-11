// import React, { useState } from "react";
// import CommonButton from "../../../components/ui/Button";

<<<<<<< HEAD
=======
// const DeekshaForm = ({ }) => {
//   const [progress, setProgress] = useState(5);
//   const [prefix, setPrefix] = useState('');

//   // Updating the state with the selected radio value
//   const [formData, setFormData] = useState({
//     namePrefix: '',
//     name: prefix + ' ' + '',
//     care_of: '',
//     address: {
//       address1: '',
//       address2: '',
//       address3: '',
//       address4: '',
//     },
//     pinCode: '',
//     district: '',
//     state: '',
//     country: '',
//     pan: '',
//     phoneNumber: '',
//     aadhar: '',
//     email: '',
//     age: '',
//     occupation: '',
//     mentalDisabilities: '',
//     educationalDegree: '',
//     hearingProblems: '',
//     priorDeekshaExperience: '',
//     guardian_signature: '',
//     spouse_signature: '',
//     bookRead: '',
//     sadhuReference: '',
//     deekshaWishDuration: '',
//     familyDeeksha: '',
//     deekshaPractice: '',
//     signature: '',
//     date: ''
//   });

//   // Function to handle changes in the form fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value

//     });
//   };
//   console.log(formData)

//   // Function to handle radio button change
//   const handleRadioChange = (event) => {
//     setFormData({
//       ...formData,
//       namePrefix: event.target.value
//     });
//     setPrefix(event.target.value)
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle the form submission logic
//   };

//   return (
//     <div className="application-form" style={{ padding: "60px" }}>
//       <form onSubmit={handleSubmit}>
//         <div className="progress-bar-container">
//           <div className="progress-bar" style={{ width: `${progress}%` }}></div>
//         </div>
//         <div
//           className="main"
//           style={{
//             padding: "60px",
//             borderRadius: "10px",
//             boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           <div
//             className="section"
//             style={{
//               border: "1px solid gray",
//               borderRadius: "10px",
//               padding: "60px",
//             }}
//           >
//             <div
//               className="form-section"
//               style={{ display: "flex", flexDirection: "column" }}
//             >
//               <div className="form-group">
//                 <label>Name:</label>
//                 <div>
//                   <input type="radio" name="raa" id="Sn" value='Sn' 
//                   onChange={handleRadioChange} 
//                   />
//                   <label htmlFor="Sn">Sn</label>

//                   <input
//                     type="radio"
//                     id="Smit"
//                     name="raa"
//                     style={{ marginLeft: "30px" }}
//                     value='Smit' 
//                     onChange={handleRadioChange} 
//                   />
//                   <label htmlFor="Smit">Smit</label>

//                   <input
//                     type="radio"
//                     id="Kumar"
//                     name="raa"
//                     style={{ marginLeft: "30px" }}
//                     value='Kumar' 
//                     onChange={handleRadioChange} 
//                   />
//                   <label htmlFor="Kumar">Kumar</label>

//                   <input
//                     type="radio"
//                     id="Kumari"
//                     name="raa"
//                     style={{ marginLeft: "30px" }}
//                     value='Kumari' 
//                     onChange={handleRadioChange} 
//                   />
//                   <label htmlFor="Kumari">Kumari</label>
//                 </div>

//                 <input
//                   type="text"
//                   name="name"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.name}/>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="">
//                   (Married/Ummarried/Widow/Widower) Full Postal Address: C/0
//                   (Father/Husband/Son)
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.care_of}/>
//               </div>
//             </div>

//             {/* Address Inputs */}
//             <div className="form-section">
//               <div className="form-left-section">
//                 <div className="form-group">
//                   <label>Full Postal Address: Address 1</label>
//                   <input type="text" placeholder="Address 1" 
//                   onChange={handleInputChange}
//                   value={formData.address.address1}/>
//                 </div>
//                 <div className="form-group">
//                   <label>Address 3</label>
//                   <input type="text" placeholder="Address 3" 
//                   onChange={handleInputChange}
//                   value={formData.address.address3}/>
//                 </div>
//               </div>
//               <div className="form-right-section">
//                 <div className="form-group">
//                   <label>Address 2</label>
//                   <input type="text" placeholder="Address 2" 
//                   onChange={handleInputChange}
//                   value={formData.address.address2}/>
//                 </div>
//                 <div className="form-group">
//                   <label>Address 4</label>
//                   <input type="text" placeholder="Address 4" 
//                   onChange={handleInputChange}
//                   value={formData.address.address4}/>
//                 </div>
//               </div>
//             </div>

//             {/* State, District, Pin Code, Country in one line */}
//             <div
//               className="address-section"
//               style={{ display: "flex", gap: "20px" }}
//             >
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>PinCode</label>
//                 <input type="text" placeholder="PineCode" 
//                 onChange={handleInputChange}
//                 value={formData.pinCode}/>
//               </div>
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>District</label>
//                 <input
//                   type="text"
//                   name="district"
//                   placeholder="Enter your district"
//                   onChange={handleInputChange}
//                     value={formData.district}

//                 />
//               </div>
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>State</label>
//                 <input type="text" placeholder="Enter State" 
//                 onChange={handleInputChange}
//                 value={formData.state}/>
//               </div>
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>Country</label>
//                 <input
//                   type="text"
//                   name="country"
//                   placeholder="Enter your country"
//                   onChange={handleInputChange}
//                     value={formData.country}
//                 />
//               </div>
//             </div>

//             {/* PAN, Phone Number, Aadhar, Email Inputs */}
//             <div className="form-section">
//               <div className="form-left-section">
//                 <div className="form-group">
//                   <label>PAN</label>
//                   <input type="text" placeholder="PAN" 
//                   onChange={handleInputChange}
//                   value={formData.pan}/>
//                 </div>
//                 <div className="form-group">
//                   <label>Phone Number</label>
//                   <input type="text" placeholder="Phone Number" 
//                   onChange={handleInputChange}
//                   value={formData.phoneNumber}/>
//                 </div>
//               </div>
//               <div className="form-right-section">
//                 <div className="form-group">
//                   <label>Aadhar</label>
//                   <input type="text" placeholder="Aadhar" 
//                   onChange={handleInputChange}
//                   value={formData.aadhar}/>
//                 </div>
//                 <div className="form-group">
//                   <label>Email</label>
//                   <input type="text" placeholder="Email" 
//                   onChange={handleInputChange}
//                   value={formData.email}/>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="div">
//             <h2>Deeksha Details</h2>
//             <div className="form-section">
//               <div className="form-left-section">
//                 <div className="form-group">
//                   <label>1. Age</label>
//                   <input type="text" placeholder="34" 
                  
//                   onChange={handleInputChange}
//                   value={formData.age}/>
//                 </div>
//                 <div className="form-group">
//                   <label>2. Occupaction</label>
//                   <input type="text" placeholder="Occupaction" 
//                   onChange={handleInputChange}
//                   value={formData.occupation}/>
//                 </div>
//                 <div className="form-group">
//                   <label>3. Any Mental/Physical Disabilities?</label>
//                   <input
//                     type="text"
//                     placeholder="Any Mental/Physical Disabilities?"
//                   onChange={handleInputChange}
// value={formData.mentalDisabilities}
//                   />
//                 </div>
//               </div>
//               <div className="form-right-section">
//                 <div className="form-group">
//                   <label>Educational Degree/Qualification</label>
//                   <input
//                     type="text"
//                     placeholder="Educational Degree/Qualification"
//                   onChange={handleInputChange}
// value={formData.educationalDegree}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Hearing Problems?</label>
//                   <input type="text" placeholder="Hearing Problems?" 
//                   onChange={handleInputChange}
//                   value={formData.hearingProblems}/>
//                 </div>
//               </div>
//             </div>
//             <div
//               className="form-section"
//               style={{ display: "flex", flexDirection: "column" }}
//             >
//               <div className="form-group">
//                 <label htmlFor="">
//                   4. Any prior experiences in obtaining Deeksha?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.priorDeekshaExperience}
//                 />
//               </div>
//               <div className="form-group file-upload-section">
//                 <label>
//                   5. If the deekshatri is a child/teenager,
//                   mother/father/guardian’s permission signature:
//                 </label>
//                 <div className="upload-container">
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".jpeg, .png, .svg"
//                     style={{ display: "none" }}
//                   onChange={handleInputChange}
//                   // value={formData}
//                   />
//                   <label htmlFor="file-upload" className="upload-label">
//                     <div className="upload-icon">&#8593;</div>{" "}
//                     <div className="upload-text">
//                       Drag and drop files here to upload.
//                       <br />
//                       <span className="upload-subtext">
//                         {"Only JPEG, PNG, and SVG files are allowed."}
//                       </span>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="upload-text">
//                   <span
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 500,
//                       color: "green",
//                     }}
//                   ></span>
//                 </div>
//               </div>
//               <div className="form-group file-upload-section">
//                 <label>
//                   6. If a man/woman is obtaining deeksha alone, have they taken
//                   spousal consent?
//                 </label>
//                 <div>
//                   <input type="radio" name="radio" id="yes" checked />
//                   <label htmlFor="yes">Yes</label>
//                   <input
//                     type="radio"
//                     name="radio"
//                     id="no"
//                     style={{ marginLeft: "30px" }}
//                   onChange={handleInputChange}
//                   // value={formData}
//                   />
//                   <label htmlFor="no">No</label>
//                 </div>

//                 <label>Add signature</label>
//                 <div className="upload-container">
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".jpeg, .png, .svg"
//                     style={{ display: "none" }}
//                   onChange={handleInputChange}
//                   // value={formData}
//                   />
//                   <label htmlFor="file-upload" className="upload-label">
//                     <div className="upload-icon">&#8593;</div>{" "}
//                     <div className="upload-text">
//                       Drag and drop files here to upload.
//                       <br />
//                       <span className="upload-subtext">
//                         {"Only JPEG, PNG, and SVG files are allowed."}
//                       </span>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="upload-text">
//                   <span
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 500,
//                       color: "green",
//                     }}
//                   ></span>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   7. What books have you read about Swami Ramkrishnadev, Smt.
//                   Sharadadevi or Swami Vivekananda?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.bookRead}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   8. If you are familiar with any sadhu at Ramkrishna math or
//                   mission, state their name
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.sadhuReference}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   9. How long have you wanted to obtain Deeksha from Ramkrishna
//                   math?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.deekshaWishDuration}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   10. If someone in your family has obtained deeksha state their
//                   name, relation to you and person they have obtained deeksha
//                   from
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.familyDeeksha}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="">
//                   11. If you obtain Deeksha will you be able to practice it
//                   properly?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.deekshaPractice}
//                 />
//               </div>

//               <div className="form-group file-upload-section">
//                 <label>12. Signature of Deekshatri</label>
//                 <div className="upload-container">
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".jpeg, .png, .svg"
//                     style={{ display: "none" }}
//                   onChange={handleInputChange}
//                   value={formData.signature}
//                   />
//                   <label htmlFor="file-upload" className="upload-label">
//                     <div className="upload-icon">&#8593;</div>{" "}
//                     <div className="upload-text">
//                       Drag and drop files here to upload.
//                       <br />
//                       <span className="upload-subtext">
//                         {"Only JPEG, PNG, and SVG files are allowed."}
//                       </span>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="upload-text">
//                   <span
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 500,
//                       color: "green",
//                     }}
//                   ></span>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">13. Date</label>
//                 <input
//                   type="date"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.date}
//                 />
//               </div>
//               <div className="submit-button">
//                 <CommonButton
//                   buttonName="Submit"
//                   style={{
//                     backgroundColor: "#9867E9",
//                     color: "#FFFFFF",
//                     borderColor: "#9867E9",
//                     fontSize: "18px",
//                     borderRadius: "7px",
//                     borderWidth: 1,
//                     padding: "15px 100px",
//                   }}
//                   onClick={handleSubmit}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DeekshaForm;




// import React, { useState } from "react";
// import CommonButton from "../../../components/ui/Button";

>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
// const DeekshaForm = ({}) => {
//   const [progress, setProgress] = useState(5);
//   const [prefix, setPrefix] = useState("");

//   // Updating the state with the selected radio value
//   const [formData, setFormData] = useState({
//     namePrefix: "",
//     name: prefix + " " + "",
//     care_of: "",
//     address: {
//       address1: "",
//       address2: "",
//       address3: "",
//       address4: "",
//     },
//     pinCode: "",
//     district: "",
//     state: "",
//     country: "",
//     pan: "",
//     phoneNumber: "",
//     aadhar: "",
//     email: "",
//     age: "",
//     occupation: "",
//     mentalDisabilities: "",
//     educationalDegree: "",
//     hearingProblems: "",
//     priorDeekshaExperience: "",
//     guardian_signature: "",
//     spouse_signature: "",
//     bookRead: "",
//     sadhuReference: "",
//     deekshaWishDuration: "",
//     familyDeeksha: "",
//     deekshaPractice: "",
//     signature: "",
//     date: "",
//   });

//   // Function to handle changes in the form fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
//   console.log(formData);

//   // Function to handle radio button change
//   const handleRadioChange = (event) => {
//     setFormData({
//       ...formData,
//       namePrefix: event.target.value,
//     });
//     setPrefix(event.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle the form submission logic
//   };

//   return (
//     <div className="application-form" style={{ padding: "60px" }}>
//       <form onSubmit={handleSubmit}>
//         <div className="progress-bar-container">
//           <div className="progress-bar" style={{ width: `${progress}%` }}></div>
//         </div>
//         <div
//           className="main"
//           style={{
//             padding: "60px",
//             borderRadius: "10px",
//             boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           <div
//             className="section"
//             style={{
//               border: "1px solid gray",
//               borderRadius: "10px",
//               padding: "60px",
//             }}
//           >
//             <div
//               className="form-section"
//               style={{ display: "flex", flexDirection: "column" }}
//             >
//               <div className="form-group">
//                 <label>Name:</label>
//                 <div>
//                   <input
//                     type="radio"
//                     name="raa"
//                     id="Sn"
//                     value="Sn"
//                     onChange={handleRadioChange}
//                   />
//                   <label htmlFor="Sn">Sn</label>

//                   <input
//                     type="radio"
//                     id="Smit"
//                     name="raa"
//                     style={{ marginLeft: "30px" }}
//                     value="Smit"
//                     onChange={handleRadioChange}
//                   />
//                   <label htmlFor="Smit">Smit</label>

//                   <input
//                     type="radio"
//                     id="Kumar"
//                     name="raa"
//                     style={{ marginLeft: "30px" }}
//                     value="Kumar"
//                     onChange={handleRadioChange}
//                   />
//                   <label htmlFor="Kumar">Kumar</label>

//                   <input
//                     type="radio"
//                     id="Kumari"
//                     name="raa"
//                     style={{ marginLeft: "30px" }}
//                     value="Kumari"
//                     onChange={handleRadioChange}
//                   />
//                   <label htmlFor="Kumari">Kumari</label>
//                 </div>

//                 <input
//                   type="text"
//                   name="name"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.name}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="">
//                   (Married/Ummarried/Widow/Widower) Full Postal Address: C/0
//                   (Father/Husband/Son)
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.care_of}
//                 />
//               </div>
//             </div>

//             {/* Address Inputs */}
//             <div className="form-section">
//               <div className="form-left-section">
//                 <div className="form-group">
//                   <label>Full Postal Address: Address 1</label>
//                   <input
//                     type="text"
//                     placeholder="Address 1"
//                     onChange={handleInputChange}
//                     value={formData.address.address1}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Address 3</label>
//                   <input
//                     type="text"
//                     placeholder="Address 3"
//                     onChange={handleInputChange}
//                     value={formData.address.address3}
//                   />
//                 </div>
//               </div>
//               <div className="form-right-section">
//                 <div className="form-group">
//                   <label>Address 2</label>
//                   <input
//                     type="text"
//                     placeholder="Address 2"
//                     onChange={handleInputChange}
//                     value={formData.address.address2}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Address 4</label>
//                   <input
//                     type="text"
//                     placeholder="Address 4"
//                     onChange={handleInputChange}
//                     value={formData.address.address4}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* State, District, Pin Code, Country in one line */}
//             <div
//               className="address-section"
//               style={{ display: "flex", gap: "20px" }}
//             >
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>PinCode</label>
//                 <input
//                   type="text"
//                   placeholder="PineCode"
//                   onChange={handleInputChange}
//                   value={formData.pinCode}
//                 />
//               </div>
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>District</label>
//                 <input
//                   type="text"
//                   name="district"
//                   placeholder="Enter your district"
//                   onChange={handleInputChange}
//                   value={formData.district}
//                 />
//               </div>
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>State</label>
//                 <input
//                   type="text"
//                   placeholder="Enter State"
//                   onChange={handleInputChange}
//                   value={formData.state}
//                 />
//               </div>
//               <div className="form-group" style={{ flex: 1 }}>
//                 <label>Country</label>
//                 <input
//                   type="text"
//                   name="country"
//                   placeholder="Enter your country"
//                   onChange={handleInputChange}
//                   value={formData.country}
//                 />
//               </div>
//             </div>

//             {/* PAN, Phone Number, Aadhar, Email Inputs */}
//             <div className="form-section">
//               <div className="form-left-section">
//                 <div className="form-group">
//                   <label>PAN</label>
//                   <input
//                     type="text"
//                     placeholder="PAN"
//                     onChange={handleInputChange}
//                     value={formData.pan}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Phone Number</label>
//                   <input
//                     type="text"
//                     placeholder="Phone Number"
//                     onChange={handleInputChange}
//                     value={formData.phoneNumber}
//                   />
//                 </div>
//               </div>
//               <div className="form-right-section">
//                 <div className="form-group">
//                   <label>Aadhar</label>
//                   <input
//                     type="text"
//                     placeholder="Aadhar"
//                     onChange={handleInputChange}
//                     value={formData.aadhar}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Email</label>
//                   <input
//                     type="text"
//                     placeholder="Email"
//                     onChange={handleInputChange}
//                     value={formData.email}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="div">
//             <h2>Deeksha Details</h2>
//             <div className="form-section">
//               <div className="form-left-section">
//                 <div className="form-group">
//                   <label>1. Age</label>
//                   <input
//                     type="text"
//                     placeholder="34"
//                     onChange={handleInputChange}
//                     value={formData.age}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>2. Occupaction</label>
//                   <input
//                     type="text"
//                     placeholder="Occupaction"
//                     onChange={handleInputChange}
//                     value={formData.occupation}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>3. Any Mental/Physical Disabilities?</label>
//                   <input
//                     type="text"
//                     placeholder="Any Mental/Physical Disabilities?"
//                     onChange={handleInputChange}
//                     value={formData.mentalDisabilities}
//                   />
//                 </div>
//               </div>
//               <div className="form-right-section">
//                 <div className="form-group">
//                   <label>Educational Degree/Qualification</label>
//                   <input
//                     type="text"
//                     placeholder="Educational Degree/Qualification"
//                     onChange={handleInputChange}
//                     value={formData.educationalDegree}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Hearing Problems?</label>
//                   <input
//                     type="text"
//                     placeholder="Hearing Problems?"
//                     onChange={handleInputChange}
//                     value={formData.hearingProblems}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div
//               className="form-section"
//               style={{ display: "flex", flexDirection: "column" }}
//             >
//               <div className="form-group">
//                 <label htmlFor="">
//                   4. Any prior experiences in obtaining Deeksha?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.priorDeekshaExperience}
//                 />
//               </div>
//               <div className="form-group file-upload-section">
//                 <label>
//                   5. If the deekshatri is a child/teenager,
//                   mother/father/guardian’s permission signature:
//                 </label>
//                 <div className="upload-container">
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".jpeg, .png, .svg"
//                     style={{ display: "none" }}
//                     onChange={handleInputChange}
//                     // value={formData}
//                   />
//                   <label htmlFor="file-upload" className="upload-label">
//                     <div className="upload-icon">&#8593;</div>{" "}
//                     <div className="upload-text">
//                       Drag and drop files here to upload.
//                       <br />
//                       <span className="upload-subtext">
//                         {"Only JPEG, PNG, and SVG files are allowed."}
//                       </span>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="upload-text">
//                   <span
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 500,
//                       color: "green",
//                     }}
//                   ></span>
//                 </div>
//               </div>
//               <div className="form-group file-upload-section">
//                 <label>
//                   6. If a man/woman is obtaining deeksha alone, have they taken
//                   spousal consent?
//                 </label>
//                 <div>
//                   <input type="radio" name="radio" id="yes" checked />
//                   <label htmlFor="yes">Yes</label>
//                   <input
//                     type="radio"
//                     name="radio"
//                     id="no"
//                     style={{ marginLeft: "30px" }}
//                     onChange={handleInputChange}
//                     // value={formData}
//                   />
//                   <label htmlFor="no">No</label>
//                 </div>

//                 <label>Add signature</label>
//                 <div className="upload-container">
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".jpeg, .png, .svg"
//                     style={{ display: "none" }}
//                     onChange={handleInputChange}
//                     // value={formData}
//                   />
//                   <label htmlFor="file-upload" className="upload-label">
//                     <div className="upload-icon">&#8593;</div>{" "}
//                     <div className="upload-text">
//                       Drag and drop files here to upload.
//                       <br />
//                       <span className="upload-subtext">
//                         {"Only JPEG, PNG, and SVG files are allowed."}
//                       </span>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="upload-text">
//                   <span
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 500,
//                       color: "green",
//                     }}
//                   ></span>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   7. What books have you read about Swami Ramkrishnadev, Smt.
//                   Sharadadevi or Swami Vivekananda?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.bookRead}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   8. If you are familiar with any sadhu at Ramkrishna math or
//                   mission, state their name
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.sadhuReference}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   9. How long have you wanted to obtain Deeksha from Ramkrishna
//                   math?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.deekshaWishDuration}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">
//                   10. If someone in your family has obtained deeksha state their
//                   name, relation to you and person they have obtained deeksha
//                   from
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.familyDeeksha}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="">
//                   11. If you obtain Deeksha will you be able to practice it
//                   properly?
//                 </label>
//                 <input
//                   type="text"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.deekshaPractice}
//                 />
//               </div>

//               <div className="form-group file-upload-section">
//                 <label>12. Signature of Deekshatri</label>
//                 <div className="upload-container">
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".jpeg, .png, .svg"
//                     style={{ display: "none" }}
//                     onChange={handleInputChange}
//                     value={formData.signature}
//                   />
//                   <label htmlFor="file-upload" className="upload-label">
//                     <div className="upload-icon">&#8593;</div>{" "}
//                     <div className="upload-text">
//                       Drag and drop files here to upload.
//                       <br />
//                       <span className="upload-subtext">
//                         {"Only JPEG, PNG, and SVG files are allowed."}
//                       </span>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="upload-text">
//                   <span
//                     style={{
//                       fontSize: 15,
//                       fontWeight: 500,
//                       color: "green",
//                     }}
//                   ></span>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="">13. Date</label>
//                 <input
//                   type="date"
//                   style={{ width: "98.5%", marginBottom: "-20px" }}
//                   onChange={handleInputChange}
//                   value={formData.date}
//                 />
//               </div>
//               <div className="submit-button">
//                 <CommonButton
//                   buttonName="Submit"
//                   style={{
//                     backgroundColor: "#9867E9",
//                     color: "#FFFFFF",
//                     borderColor: "#9867E9",
//                     fontSize: "18px",
//                     borderRadius: "7px",
//                     borderWidth: 1,
//                     padding: "15px 100px",
//                   }}
//                   onClick={handleSubmit}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DeekshaForm;

import React, { useState } from "react";
import CommonButton from "../../../components/ui/Button";
<<<<<<< HEAD
import { createDeeksha } from "../../../../services/src/services/deekshaService";
=======
// import { createDeeksha } from "../../../../services/src/services/deekshaService"; 
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
import apiClient from "../../../../services/apiClient";
import axios from "axios";

const DeekshaForm = ({}) => {
  const [progress, setProgress] = useState(5);
  const [prefix, setPrefix] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Updating the state with the selected radio value
  const [formData, setFormData] = useState({
<<<<<<< HEAD
    namePrefix: "",
    name: prefix + " " + "",
=======
    // namePrefix: "",
    name: "",
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
    care_of: "",
    address: {
      address1: "",
      address2: "",
      address3: "",
      address4: "",
    },
    pinCode: "",
    district: "",
    state: "",
    country: "",
    pan: "",
    phoneNumber: "",
    aadhar: "",
    email: "",
    age: "",
    occupation: "",
    mentalDisabilities: "",
    educationalDegree: "",
    hearingProblems: "",
    priorDeekshaExperience: "",
<<<<<<< HEAD
    guardian_signature: "",
    spouse_signature: "",
=======
    // guardian_signature: "",
    // spouse_signature: "",
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
    bookRead: "",
    sadhuReference: "",
    deekshaWishDuration: "",
    familyDeeksha: "",
    deekshaPractice: "",
<<<<<<< HEAD
    signature: "",
=======
    // signature: "",
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
    date: "",
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Store the selected file
  };

  // Function to handle changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressKey = name.split(".")[1];
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressKey]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  // Function to handle radio button change
  const handleRadioChange = (event) => {
<<<<<<< HEAD
    setFormData({
      ...formData,
      namePrefix: event.target.value,
    });
=======
    // setFormData({
    //   ...formData,
    //   namePrefix: event.target.value,
    // });
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
    setPrefix(event.target.value);
  };
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await apiClient.post("/upload", formData);
    return response.data; // This will return the uploaded file's data including the ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        data: {
<<<<<<< HEAD
          Name: formData.name,
=======
          Name: prefix + formData.name,
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
          Care_Of: formData.care_of,
          Address: `${formData.address.address1}, ${formData.address.address2}, ${formData.address.address3}, ${formData.address.address4}`,
          PAN: formData.pan,
          Aadhar: formData.aadhar,
          Phone_no: formData.phoneNumber,
          Email: formData.email,
          Age: formData.age,
          Education_Qualification: formData.educationalDegree,
          Occupation: formData.occupation,
          Hearing_Problems: formData.hearingProblems,
          Disabilities: formData.mentalDisabilities,
          Prior_Deeksha_Experience: formData.priorDeekshaExperience,
<<<<<<< HEAD
          Guardian_signature:
            formData.guardian_signature || "default_signature",
          Spouse_signature: formData.spouse_signature || "default_signature",
=======
          // Guardian_signature:
          //   formData.guardian_signature || "default_signature",
          // Spouse_signature: formData.spouse_signature || "default_signature",
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
          Books_read: formData.bookRead,
          Sadhu_Reference: formData.sadhuReference,
          Deeksha_Wish_Duration: formData.deekshaWishDuration,
          Family_Deeksha: formData.familyDeeksha,
          Deeksha_Practice: formData.deekshaPractice,
<<<<<<< HEAD
          Signature: formData.signature || "default_signature",
=======
          // Signature: formData.signature || "default_signature",
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
          Date: formData.date,
          Pincode: formData.pinCode,
          District: formData.district,
          State: formData.state,
          Country: formData.country,
        },
      };

      // Log data before sending
      console.log("Data to send:", JSON.stringify(dataToSend, null, 2));

<<<<<<< HEAD
      const response = await axios.post(
=======
      const response = await 
      // createDeeksha (dataToSend)
      axios.post(
>>>>>>> 6041bc2a1986e0ece76f51df76f098219fb9a97a
        "http://localhost:1337/api/deekshas",
        dataToSend
      );

      // Log success response
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      // Log error details for better understanding
      console.error(
        "Error submitting form:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="application-form" style={{ padding: "60px" }}>
      <form onSubmit={handleSubmit}>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div
          className="main"
          style={{
            padding: "60px",
            borderRadius: "10px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="section"
            style={{
              border: "1px solid gray",
              borderRadius: "10px",
              padding: "60px",
            }}
          >
            <div
              className="form-section"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="form-group">
                <label>Name:</label>
                <div>
                  <input
                    type="radio"
                    name="raa"
                    id="Sn"
                    value="Sn"
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="Sn">Sn</label>

                  <input
                    type="radio"
                    id="Smit"
                    name="raa"
                    style={{ marginLeft: "30px" }}
                    value="Smit"
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="Smit">Smit</label>

                  <input
                    type="radio"
                    id="Kumar"
                    name="raa"
                    style={{ marginLeft: "30px" }}
                    value="Kumar"
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="Kumar">Kumar</label>

                  <input
                    type="radio"
                    id="Kumari"
                    name="raa"
                    style={{ marginLeft: "30px" }}
                    value="Kumari"
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="Kumari">Kumari</label>
                </div>

                <input
                  type="text"
                  name="name"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">
                  (Married/Ummarried/Widow/Widower) Full Postal Address: C/0
                  (Father/Husband/Son)
                </label>
                <input
                  type="text"
                  name="care_of"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.care_of}
                />
              </div>
            </div>

            {/* Address Inputs */}
            <div className="form-section">
              <div className="form-left-section">
                <div className="form-group">
                  <label>Full Postal Address: Address 1</label>
                  <input
                    type="text"
                    name="address.address1"
                    placeholder="Address 1"
                    onChange={handleInputChange}
                    value={formData.address.address1}
                  />
                </div>
                <div className="form-group">
                  <label>Address 3</label>
                  <input
                    type="text"
                    name="address.address3"
                    placeholder="Address 3"
                    onChange={handleInputChange}
                    value={formData.address.address3}
                  />
                </div>
              </div>
              <div className="form-right-section">
                <div className="form-group">
                  <label>Address 2</label>
                  <input
                    type="text"
                    name="address.address2"
                    placeholder="Address 2"
                    onChange={handleInputChange}
                    value={formData.address.address2}
                  />
                </div>
                <div className="form-group">
                  <label>Address 4</label>
                  <input
                    type="text"
                    name="address.address4"
                    placeholder="Address 4"
                    onChange={handleInputChange}
                    value={formData.address.address4}
                  />
                </div>
              </div>
            </div>

            {/* State, District, Pin Code, Country in one line */}
            <div
              className="address-section"
              style={{ display: "flex", gap: "20px" }}
            >
              <div className="form-group" style={{ flex: 1 }}>
                <label>PinCode</label>
                <input
                  type="text"
                  name="pinCode"
                  placeholder="PinCode"
                  onChange={handleInputChange}
                  value={formData.pinCode}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>District</label>
                <input
                  type="text"
                  name="district"
                  placeholder="Enter your district"
                  onChange={handleInputChange}
                  value={formData.district}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter State"
                  onChange={handleInputChange}
                  value={formData.state}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Enter your country"
                  onChange={handleInputChange}
                  value={formData.country}
                />
              </div>
            </div>

            {/* PAN, Phone Number, Aadhar, Email Inputs */}
            <div className="form-section">
              <div className="form-left-section">
                <div className="form-group">
                  <label>PAN</label>
                  <input
                    type="text"
                    name="pan"
                    placeholder="PAN"
                    onChange={handleInputChange}
                    value={formData.pan}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    onChange={handleInputChange}
                    value={formData.phoneNumber}
                  />
                </div>
              </div>
              <div className="form-right-section">
                <div className="form-group">
                  <label>Aadhar</label>
                  <input
                    type="text"
                    name="aadhar"
                    placeholder="Aadhar"
                    onChange={handleInputChange}
                    value={formData.aadhar}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="div">
            <h2>Deeksha Details</h2>
            <div className="form-section">
              <div className="form-left-section">
                <div className="form-group">
                  <label>1. Age</label>
                  <input
                    type="text"
                    name="age"
                    placeholder="34"
                    onChange={handleInputChange}
                    value={formData.age}
                  />
                </div>
                <div className="form-group">
                  <label>2. Occupaction</label>
                  <input
                    type="text"
                    name="occupation"
                    placeholder="Occupation"
                    onChange={handleInputChange}
                    value={formData.occupation}
                  />
                </div>
                <div className="form-group">
                  <label>3. Any Mental/Physical Disabilities?</label>
                  <input
                    type="text"
                    name="mentalDisabilities"
                    placeholder="Any Mental/Physical Disabilities?"
                    onChange={handleInputChange}
                    value={formData.mentalDisabilities}
                  />
                </div>
              </div>
              <div className="form-right-section">
                <div className="form-group">
                  <label>Educational Degree/Qualification</label>
                  <input
                    type="text"
                    name="educationalDegree"
                    placeholder="Educational Degree/Qualification"
                    onChange={handleInputChange}
                    value={formData.educationalDegree}
                  />
                </div>
                <div className="form-group">
                  <label>Hearing Problems?</label>
                  <input
                    type="text"
                    name="hearingProblems"
                    placeholder="Hearing Problems?"
                    onChange={handleInputChange}
                    value={formData.hearingProblems}
                  />
                </div>
              </div>
            </div>
            <div
              className="form-section"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className="form-group">
                <label htmlFor="">
                  4. Any prior experiences in obtaining Deeksha?
                </label>
                <input
                  type="text"
                  name="priorDeekshaExperience"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.priorDeekshaExperience}
                />
              </div>
              <div className="form-group file-upload-section">
                <label>
                  5. If the deekshatri is a child/teenager,
                  mother/father/guardian’s permission signature:
                </label>
                <div className="upload-container">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpeg, .png, .svg"
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">&#8593;</div>{" "}
                    <div className="upload-text">
                      Drag and drop files here to upload.
                      <br />
                      <span className="upload-subtext">
                        {"Only JPEG, PNG, and SVG files are allowed."}
                      </span>
                    </div>
                  </label>
                </div>
                <div className="upload-text">
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "green",
                    }}
                  ></span>
                </div>
              </div>
              <div className="form-group file-upload-section">
                <label>
                  6. If a man/woman is obtaining deeksha alone, have they taken
                  spousal consent?
                </label>
                <div>
                  <input type="radio" name="radio" id="yes" checked />
                  <label htmlFor="yes">Yes</label>
                  <input
                    type="radio"
                    name="radio"
                    id="no"
                    style={{ marginLeft: "30px" }}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="no">No</label>
                </div>

                <label>Add signature</label>
                <div className="upload-container">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpeg, .png, .svg"
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">&#8593;</div>{" "}
                    <div className="upload-text">
                      Drag and drop files here to upload.
                      <br />
                      <span className="upload-subtext">
                        {"Only JPEG, PNG, and SVG files are allowed."}
                      </span>
                    </div>
                  </label>
                </div>
                <div className="upload-text">
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "green",
                    }}
                  ></span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="">
                  7. What books have you read about Swami Ramkrishnadev, Smt.
                  Sharadadevi or Swami Vivekananda?
                </label>
                <input
                  type="text"
                  name="bookRead"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.bookRead}
                />
              </div>

              <div className="form-group">
                <label htmlFor="">
                  8. If you are familiar with any sadhu at Ramkrishna math or
                  mission, state their name
                </label>
                <input
                  type="text"
                  name="sadhuReference"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.sadhuReference}
                />
              </div>

              <div className="form-group">
                <label htmlFor="">
                  9. How long have you wanted to obtain Deeksha from Ramkrishna
                  math?
                </label>
                <input
                  type="text"
                  name="deekshaWishDuration"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.deekshaWishDuration}
                />
              </div>

              <div className="form-group">
                <label htmlFor="">
                  10. If someone in your family has obtained deeksha state their
                  name, relation to you and person they have obtained deeksha
                  from
                </label>
                <input
                  type="text"
                  name="familyDeeksha"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.familyDeeksha}
                />
              </div>
              <div className="form-group">
                <label htmlFor="">
                  11. If you obtain Deeksha will you be able to practice it
                  properly?
                </label>
                <input
                  type="text"
                  name="deekshaPractice"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.deekshaPractice}
                />
              </div>

              <div className="form-group file-upload-section">
                <label>12. Signature of Deekshatri</label>
                <div className="upload-container">
                  <input
                    id="file-upload"
                    type="file"
                    name="signature"
                    accept=".jpeg, .png, .svg"
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">&#8593;</div>{" "}
                    <div className="upload-text">
                      Drag and drop files here to upload.
                      <br />
                      <span className="upload-subtext">
                        {"Only JPEG, PNG, and SVG files are allowed."}
                      </span>
                    </div>
                  </label>
                </div>
                <div className="upload-text">
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "green",
                    }}
                  ></span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="">13. Date</label>
                <input
                  type="date"
                  name="date"
                  style={{ width: "98.5%", marginBottom: "-20px" }}
                  onChange={handleInputChange}
                  value={formData.date}
                />
              </div>
              <div className="submit-button">
                <CommonButton
                  buttonName="Submit"
                  style={{
                    backgroundColor: "#9867E9",
                    color: "#FFFFFF",
                    borderColor: "#9867E9",
                    fontSize: "18px",
                    borderRadius: "7px",
                    borderWidth: 1,
                    padding: "15px 100px",
                  }}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeekshaForm;
