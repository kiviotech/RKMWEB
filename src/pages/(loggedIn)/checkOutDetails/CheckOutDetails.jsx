import React from 'react'
import './CheckoutDetails.scss'
import SearchBar from '../../../components/ui/SearchBar';
import CommonHeaderTitle from '../../../components/ui/CommonHeaderTitle';

const checkInGuest = [
    { name: "Mrs. John Dee", referenceNo: '20240103-002', Roomno: "Gh-03", Donation: "Paid", id: 1 },
    { name: "Mrs. John Dee", referenceNo: '20240103-002', Roomno: "Gh-03", Donation: "Not Paid", id: 2 },
    { name: "Mrs. John Dee", referenceNo: '20240103-002', Roomno: "Gh-03", Donation: "Paid", id: 3 },
    { name: "Mrs. John Dee", referenceNo: '20240103-002', Roomno: "Gh-03", Donation: "Paid", id: 4 },
];

const CheckOutDetails = () => {
    return (
        <div className="check-in-main-container">
            <div className="check-in-datails check-out-details">
                <div className="header">
                    <CommonHeaderTitle title="Check-outs" />
                    <SearchBar />
                </div>
                <div className="progressBar">
                    <div className="progress checkoutProgress">
                        <div className="progress-fill checkoutProgress-fill" style={{ width: '53%' }}></div>
                    </div>
                    <div className="progress-text">Checked-in: 53/120</div>
                </div>
                <div className="table-section">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Reference no.</th>
                                <th>Room no.</th>
                                <th>Donation</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkInGuest.map((guest) => (
                                <tr key={guest.id}>
                                    <td>{guest.name}</td>
                                    <td>{guest.referenceNo}</td>
                                    <td>{guest.Roomno}</td>
                                    <td>
                                        <span className={guest.Donation === 'Paid' ? 'donation-paid' : 'donation-not-paid'}>
                                            {guest.Donation}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="check-in-button checkout">Check out</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div className="scanned-qr-main-section">
                {/* Additional content */}
            </div>
        </div>
    );
}

export default CheckOutDetails;