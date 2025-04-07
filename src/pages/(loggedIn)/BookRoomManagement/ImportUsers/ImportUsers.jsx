import React, { useState } from 'react';
import './ImportUsers.scss';
import { createUser } from '../../../../services/userServices'; // Corrected import path

const ImportUsers = () => {
  const [importProgress, setImportProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const validateUser = (user) => {
    const errors = [];
    if (!user.name || user.name.length < 2) errors.push('Invalid name');
    if (!user.phone || !/^\d{10}$/.test(user.phone)) errors.push('Invalid phone number');
    if (user.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(user.panCard)) errors.push('Invalid PAN');
    if (user.aadharCard && !/^\d{12}$/.test(user.aadharCard)) errors.push('Invalid Aadhar');
    return errors;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const users = JSON.parse(e.target.result);
        const totalUsers = users.length;
        const errorsList = [];
        let processed = 0;

        for (const user of users) {
          const validationErrors = validateUser(user);

          if (validationErrors.length > 0) {
            errorsList.push({
              user: user.name,
              errors: validationErrors
            });
          } else {
            try {
              await createUser(user);
            } catch (error) {
              errorsList.push({
                user: user.name,
                errors: ['API Error: ' + error.message]
              });
            }
          }

          processed++;
          setImportProgress((processed / totalUsers) * 100);
        }

        setErrors(errorsList);
      } catch (error) {
        console.error('Error parsing file:', error);
      }
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="import-users">
      <h2>Import Users</h2>
      <div className="import-section">
        <input 
          type="file" 
          accept=".json"
          onChange={handleFileUpload}
          disabled={isImporting}
        />
        {isImporting && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${importProgress}%` }}
            ></div>
            <span>{Math.round(importProgress)}%</span>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="error-section">
          <h3>Import Errors</h3>
          <div className="error-list">
            {errors.map((error, index) => (
              <div key={index} className="error-item">
                <strong>{error.user}</strong>
                <ul>
                  {error.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportUsers;