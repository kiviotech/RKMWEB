import React, { useState } from 'react'
import CommonButton from '../../../../components/ui/Button';

const GuestDetails = () => {
    const [activeTab, setActiveTab] = useState('Guest 1');
    const [guestTabs, setGuestTabs] = useState(['Guest 1']);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        occupation: '',
        age: '',
        gender: '',
        email: '',
        deeksha: '',
        guestMembers: 1,
        aadhaar: '',
        phoneNumber: '',

        guests: [
            {
                guestName: '',
                guestAadhaar: '',
                guestNumber: '',
                guestAddress: ''
            }
        ],

        visitDate: '',
        departureDate: '',
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file === null || file === undefined) {
            setIsfileSelected(false);
        } else {
            setIsfileSelected(true);
        }

        if (validateForm()) {
            console.log("Form submitted successfully", formData);
        } else {
            console.log("Form has errors", errors);
        }
    };
    return (
        <div className="guest-details">
            <h2>Guest Details</h2>
            <div className="form-tabs custom-form-tab">
                {guestTabs.map(tab => (
                    <div
                        key={tab}
                        className={`tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {guestTabs.map((tab, index) => (
                activeTab === tab && (
                    <div key={tab} className="tab-content">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '30px'
                        }}>
                            <div className="form-left-section">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="guestName"
                                        value={formData.guests[index].guestName}
                                        onChange={(e) => handleGuestInputChange(e, index)}
                                        placeholder="John Deep"
                                    />
                                    {errors[`guestName${index}`] && <span className="error">{errors[`guestName${index}`]}</span>}
                                </div>

                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label>Aadhaar Number</label>
                                    <input
                                        type="password"
                                        name="guestAadhaar"
                                        value={formData.guests[index].guestAadhaar}
                                        onChange={(e) => handleGuestInputChange(e, index)}
                                        placeholder="Your Aadhaar no"
                                    />
                                    {/* <span style={{ color: 'var(--commonColor)', position: 'absolute', top: 47, right: 20 }}>Verify Aadhar</span> */}
                                    {errors[`guestAadhaar${index}`] && <span className="error">{errors[`guestAadhaar${index}`]}</span>}
                                </div>

                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label>Relation with Applicant</label>
                                    <input
                                        type="password"
                                        name="guestAadhaar"
                                        value={formData.guests[index].guestAadhaar}
                                        onChange={(e) => handleGuestInputChange(e, index)}
                                        placeholder="Type your relation"
                                    />
                                    {/* <span style={{ color: 'var(--commonColor)', position: 'absolute', top: 47, right: 20 }}>Verify Aadhar</span> */}
                                    {errors[`guestAadhaar${index}`] && <span className="error">{errors[`guestAadhaar${index}`]}</span>}
                                </div>
                            </div>

                            <div className="form-right-section">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="number"
                                        name="guestNumber"
                                        value={formData.guests[index].guestNumber}
                                        onChange={(e) => handleGuestInputChange(e, index)}
                                        placeholder="6264452164"
                                    />
                                    {errors[`guestNumber${index}`] && <span className="error">{errors[`guestNumber${index}`]}</span>}
                                </div>
                                {/* <div className="form-group">
                                <label>Initiation / Mantra Diksha from </label>

                                <select>
                                    <option value="">Select Deeksha</option>
                                    <option value="">Sri Sarada Devi – Life and Teachings</option>
                                    <option value="">Sri Sarada Devi – Life and Teachings</option>
                                    <option value="">Swami Vivekananda – His Life and Legacy</option>
                                    <option value="">The Gospel of Sri Ramakrishna</option>
                                    <option value="">None</option>
                                </select>
                                {errors.deeksha && <span className="error">{errors.deeksha}</span>}
                            </div> */}

                                <div className="form-group">
                                    <label>Occupation</label>
                                    <input
                                        type="text"
                                        name="guestAddress"
                                        value={formData.guests[index].guestAddress}
                                        onChange={(e) => handleGuestInputChange(e, index)}
                                        placeholder="Enter Your occupation"
                                    />
                                    {errors[`guestAddress${index}`] && <span className="error">{errors[`guestAddress${index}`]}</span>}
                                </div>
                            </div>


                        </div>

                        <div>
                            <div className="address-section">
                                <h3>Address 1</h3>

                                <div className="formTabSection">
                                    <div className="addressInputBox">
                                        <div className="form-group">
                                            <label>State</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                placeholder="Enter Your State"
                                            />
                                            {errors.occupation && <span className="error">{errors.occupation}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>House Number</label>

                                            <input
                                                type="text"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange} placeholder="Your house number"
                                            />
                                            {errors.gender && <span className="error">{errors.gender}</span>}
                                        </div>

                                    </div>
                                    <div className="addressInputBox">
                                        <div className="form-group">
                                            <label>District</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                placeholder="Enter your district"
                                            />
                                            {errors.occupation && <span className="error">{errors.occupation}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Street Name</label>

                                            <input
                                                type="text"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange} placeholder="Street name"
                                            />
                                            {errors.gender && <span className="error">{errors.gender}</span>}
                                        </div>

                                    </div>

                                    <div className="addressInputBox">
                                        <div className="form-group">
                                            <label>Pin Code</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                placeholder="Enter Pincode"
                                            />
                                            {errors.occupation && <span className="error">{errors.occupation}</span>}
                                        </div>



                                    </div>


                                </div>

                            </div>

                            <div className="address-section">
                                <h3>Address 2</h3>

                                <div className="formTabSection">
                                    <div className="addressInputBox">
                                        <div className="form-group">
                                            <label>State</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                placeholder="Enter Your State"
                                            />
                                            {errors.occupation && <span className="error">{errors.occupation}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>House Number</label>

                                            <input
                                                type="text"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange} placeholder="Your house number"
                                            />
                                            {errors.gender && <span className="error">{errors.gender}</span>}
                                        </div>

                                    </div>
                                    <div className="addressInputBox">
                                        <div className="form-group">
                                            <label>District</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                placeholder="Enter your district"
                                            />
                                            {errors.occupation && <span className="error">{errors.occupation}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Street Name</label>

                                            <input
                                                type="text"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange} placeholder="Street name"
                                            />
                                            {errors.gender && <span className="error">{errors.gender}</span>}
                                        </div>

                                    </div>

                                    <div className="addressInputBox">
                                        <div className="form-group">
                                            <label>Pin Code</label>
                                            <input
                                                type="text"
                                                name="occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange}
                                                placeholder="Enter Pincode"
                                            />
                                            {errors.occupation && <span className="error">{errors.occupation}</span>}
                                        </div>



                                    </div>


                                </div>

                            </div>
                        </div>

                    </div>

                )
            ))}

            <div className="submit-button" style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 30px' }}>
                <CommonButton
                    buttonName="Back"
                    style={{ backgroundColor: '#FFF', color: '#000', borderColor: '#4B4B4B', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '15px 20px' }}
                />
                <CommonButton
                    buttonName="Proceed"
                    style={{ backgroundColor: '#9867E9', color: '#FFFFFF', borderColor: '#9867E9', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '15px 100px' }}
                />
            </div>
        </div>

    )
}

export default GuestDetails
