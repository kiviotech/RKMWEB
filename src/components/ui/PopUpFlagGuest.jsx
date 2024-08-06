import React, { useState } from 'react';
import CommonButton from './Button';

const PopUpFlagGuest = ({ isOpen, onClose, handleFlag, iconType }) => {
    const flagReason = [
        { id: 1, text: 'Lorem Ipsum is simply dummy 1.' },
        { id: 2, text: 'Lorem Ipsum is simply dummy 2.' },
        { id: 3, text: 'Lorem Ipsum is simply dummy 3.' },
        { id: 4, text: 'Lorem Ipsum is simply dummy 4.' },
        { id: 5, text: 'Lorem Ipsum is simply dummy 5.' },
    ];
    const [selectedReason, setSelectedReason] = useState(null);
    const [otherReason, setOtherReason] = useState('');

    if (!isOpen) return null;

    const handleReasonChange = (reasonId) => {
        setSelectedReason(reasonId);
        setOtherReason('');
    };

    const handleOtherReasonChange = (e) => {
        setOtherReason(e.target.value);
        setSelectedReason('Other');
    };

    const getSelectedReasonText = () => {
        if (selectedReason === 'Other') {
            return otherReason;
        } else {
            const reason = flagReason.find(reason => reason.id === selectedReason);
            return reason ? reason.text : '';
        }
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <button style={styles.closeButton} onClick={onClose}>×</button>
                {iconType === '/src/assets/icons/crossCircle.png' ? (
                    <h2 style={styles.heading}>State your Reason to flag this Guest</h2>
                ) : (
                    <h2 style={styles.heading}>state your reason to put the guest on hold</h2>
                )}

                <div style={styles.reasonsList}>
                    {flagReason.map((reason) => (
                        <label key={reason.id} style={styles.reasonLabel}>
                            <input style={{ margin: 10, width: 15, height: 15 }}
                                type="checkbox"
                                checked={selectedReason === reason.id}
                                onChange={() => handleReasonChange(reason.id)}
                            />
                            {reason.text}
                        </label>
                    ))}
                    <label style={styles.reasonLabel}>
                        <input style={{ margin: 10, width: 15, height: 15 }}
                            type="checkbox"
                            checked={selectedReason === 'Other'}
                            onChange={() => handleReasonChange('Other')}
                        />
                        Other:
                        <input
                            type="text"
                            value={otherReason}
                            onChange={handleOtherReasonChange}
                            disabled={selectedReason !== 'Other'}
                            placeholder="Enter your Reason here..."
                            style={styles.otherReasonInput}
                        />
                    </label>
                </div>
                <div style={styles.modalActions}>
                    <CommonButton onClick={() => handleFlag(getSelectedReasonText())}
                        buttonName="Flag Guest"
                        buttonWidth="auto"
                        style={{ backgroundColor: 'var(--primary-color)', color: '#FFFFFF', borderColor: 'var(--primary-color)', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '8px 20px' }}
                    />
                    <CommonButton
                        buttonName="Cancel"
                        buttonWidth="auto"
                        style={{ backgroundColor: '#FFFFFF', color: 'var(--primary-color)', borderColor: 'var(--primary-color)', fontSize: '18px', borderRadius: '7px', borderWidth: 1, padding: '8px 20px' }}
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '520px',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: 20
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '26px',
        cursor: 'pointer',
        color: '#4B4B4B'
    },
    heading: {
        marginBottom: '20px',
        fontFamily: 'Lexend',
        fontSize: 24,
        fontWeight: 600,
    },
    reasonsList: {
        display: 'flex',
        flexDirection: 'column',
    },
    reasonLabel: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        fontFamily: 'Lexend',
        fontSize: 16,
        fontWeight: 400,
        paddingLeft: 15
    },
    otherReasonInput: {
        marginLeft: '10px',
        flex: 1,
        border: '1px solid #737373',
        borderRadius: 5,
        padding: 8,
        background: '#FFFFFF',
        color: '#959595',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 400,
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'end',
        marginTop: '20px',
        gap: 15
    },
};

export default PopUpFlagGuest;
