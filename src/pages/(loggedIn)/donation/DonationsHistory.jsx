// import React from 'react';
// import './DonationsHistory.scss';

// const DonationsHistory = () => {
//   const donations = [
//     { name: 'Mr. John Dee', reference: '20240103-002', date: '00/00/0000', amount: '₹432' },
//     { name: 'Mr. John Dee', reference: '20240103-002', date: '00/00/0000', amount: '₹432' },
//     { name: 'Mr. John Dee', reference: '20240103-002', date: '00/00/0000', amount: '₹432' },
//     { name: 'Mr. John Dee', reference: '20240103-002', date: '00/00/0000', amount: '₹432' },
//   ];

//   return (
//     <div className="donations-history">
//       <div className="header">
//         <h2>Donations History</h2>
//         <div className="controls">
//           <input type="text" placeholder="Search Guest" />
//           <button className="sort-btn">Sort by</button>
//           <button className="filter-btn">Filter</button>
//         </div>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Reference no.</th>
//             <th>Date of Donation</th>
//             <th>Donation</th>
//           </tr>
//         </thead>
//         <tbody>
//           {donations.map((donation, index) => (
//             <tr key={index}>
//               <td>
//                 <div className="avatar"></div>
//                 {donation.name}
//               </td>
//               <td>{donation.reference}</td>
//               <td>{donation.date}</td>
//               <td>
//                 {donation.amount}
//                 {index % 2 === 0 && <span className="red-dot"></span>}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DonationsHistory;
import React, { useState } from 'react';
import './DonationsHistory.scss';

const DonationsHistory = () => {
  const donations = [
    { name: 'Mr. John Dee', reference: '20240103-002', date: '00/00/0000', amount: '₹432' },
    { name: 'Ms. Jane Smith', reference: '20240103-003', date: '01/01/2024', amount: '₹500' },
    { name: 'Dr. Alex Brown', reference: '20240103-004', date: '01/02/2024', amount: '₹600' },
    { name: 'Ms. Emily White', reference: '20240103-005', date: '02/02/2024', amount: '₹700' },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  // Filter donations based on the search query
  const filteredDonations = donations.filter(donation => 
    donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.reference.includes(searchQuery)
  );

  return (
    <div className="donations-history">
      <div className="header">
        <h2>Donations History</h2>
        <div className="controls">
          <input 
            type="text" 
            placeholder="Search Guest or Reference" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} // Update state on input change
          />
          <button className="sort-btn">Sort by</button>
          <button className="filter-btn">Filter</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Reference no.</th>
            <th>Date of Donation</th>
            <th>Donation</th>
          </tr>
        </thead>
        <tbody>
          {filteredDonations.map((donation, index) => (
            <tr key={index}>
              <td>
                <div className="avatar"></div>
                {donation.name}
              </td>
              <td>{donation.reference}</td>
              <td>{donation.date}</td>
              <td>
                {donation.amount}
                {index % 2 === 0 && <span className="red-dot"></span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsHistory;

