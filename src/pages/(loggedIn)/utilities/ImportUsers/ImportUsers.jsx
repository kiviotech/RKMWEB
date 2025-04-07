
import React, { useState } from "react";
import "./ImportUsers.scss";
import { createNewUser } from "../../../../../services/src/services/userServices";
import * as XLSX from "xlsx";

const ImportUsers = () => {
  const [importProgress, setImportProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [processedUsers, setProcessedUsers] = useState(0);
  const [successList, setSuccessList] = useState([]);
  const [errorsList, setErrorsList] = useState([]);
  const [importComplete, setImportComplete] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportProgress(0);
      setProcessedUsers(0);
      setImportComplete(false);
      setSuccessList([]);
      setErrorsList([]);
    }
  };

  const processExcelFile = async () => {
    if (!file) return;

    try {
      setUploading(true);

      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setTotalUsers(jsonData.length);

        const successList = [];
        const errorsList = [];

        for (let i = 0; i < jsonData.length; i++) {
          const user = jsonData[i];

          // Validate required fields
          if (!user.name || !user.phone_number || !user.identity_number) {
            errorsList.push({
              user: user.name || "Unknown",
              error:
                "Missing required fields (name, phone number, or identity number)",
            });
          } else {
            try {
              await createNewUser(user);
              successList.push({
                name: user.name,
                phone: user.phone_number,
              });
            } catch (error) {
              errorsList.push({
                user: user.name,
                error: error.message || "Failed to create user",
              });
            }
          }

          setProcessedUsers(i + 1);
          setImportProgress(Math.round(((i + 1) / jsonData.length) * 100));
        }

        setSuccessList(successList);
        setErrorsList(errorsList);
        setImportComplete(true);
        setUploading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setUploading(false);
      setImportComplete(true);
    }
  };

  const downloadSampleTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        name: "John Doe",
        phone_number: "9876543210",
        email: "john@example.com",
        address: "123 Main St, City",
        occupation: "Engineer",
        age: 35,
        gender: "Male",
        identity_proof: "Aadhaar",
        identity_number: "123456789012",
        pan_number: "ABCDE1234F",
      },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "user_import_template.xlsx");
  };

  return (
    <div className="import-users-container">
      <div className="import-header">
        <h3>Import Users</h3>
        <p>Upload an Excel file to bulk import users into the system</p>
      </div>

      <div className="import-actions">
        <div className="file-upload-section">
          <label htmlFor="userFile" className="file-label">
            {file ? file.name : "Choose Excel File"}
          </label>
          <input
            type="file"
            id="userFile"
            accept=".xlsx, .xls"
            className="file-input"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            className="import-button"
            onClick={processExcelFile}
            disabled={!file || uploading}
          >
            {uploading ? "Importing..." : "Import Users"}
          </button>
        </div>

        <div className="template-section">
          <p>Not sure about the format?</p>
          <button className="template-button" onClick={downloadSampleTemplate}>
            Download Sample Template
          </button>
        </div>
      </div>

      {uploading && (
        <div className="progress-section">
          <div className="progress-info">
            <span>
              Importing users: {processedUsers} of {totalUsers}
            </span>
            <span className="percentage">{importProgress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${importProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {importComplete && (
        <div className="import-results">
          <div className="results-summary">
            <div className="result-card success">
              <h4>Successfully Imported</h4>
              <span className="count">{successList.length}</span>
            </div>
            <div className="result-card error">
              <h4>Failed to Import</h4>
              <span className="count">{errorsList.length}</span>
            </div>
          </div>

          <div className="results-details">
            {errorsList.length > 0 && (
              <div className="errors-section">
                <h4>Import Errors</h4>
                <div className="errors-list">
                  {errorsList.map((error, index) => (
                    <div className="error-item" key={index}>
                      <span className="error-user">{error.user}</span>
                      <span className="error-message">{error.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {successList.length > 0 && (
              <div className="success-section">
                <h4>Successfully Imported Users</h4>
                <div className="success-list">
                  {successList.map((user, index) => (
                    <div className="success-item" key={index}>
                      <span className="success-name">{user.name}</span>
                      <span className="success-phone">{user.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportUsers;
