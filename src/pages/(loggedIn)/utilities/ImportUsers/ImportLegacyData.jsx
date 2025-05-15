import React, { useState, useEffect, useRef } from "react";
import { 
  uploadMigrationFile, 
  checkMigrationProgress, 
  getMigrationResults,
  downloadSampleTemplate as fetchSampleTemplate
} from "../../../../../services/src/services/migrationService";
import * as XLSX from "xlsx";
import "./ImportUsers.scss"; // Reusing existing styles for consistency

const ImportLegacyData = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [successList, setSuccessList] = useState([]);
  const [failedList, setFailedList] = useState([]);
  const [invalidList, setInvalidList] = useState([]);
  const [skippedList, setSkippedList] = useState([]);
  const [updatedList, setUpdatedList] = useState([]);
  const [importComplete, setImportComplete] = useState(false);
  const [errorReport, setErrorReport] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const simulationTimerRef = useRef(null);
  const [jobSubmitted, setJobSubmitted] = useState(false);

  // Clean up timers on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, [pollingInterval]);

  // Periodically check real progress when job is running
  useEffect(() => {
    if (jobId && !importComplete) {
      const interval = setInterval(async () => {
        try {
          const progressData = await checkMigrationProgress(jobId);
          
          // Update REAL progress
          setImportProgress(progressData.progress || 0);
          
          // If real progress is 100%, fetch the results
          if (progressData.progress === 100) {
            clearInterval(interval);
            setPollingInterval(null);
            fetchResults(jobId);
          }
        } catch (error) {
          console.error("Error checking progress:", error);
          setUploadError("Failed to check import progress. Please try again.");
          clearInterval(interval);
          setPollingInterval(null);
          setUploading(false);
          setJobSubmitted(false); // Reset submission status on error
        }
      }, 3000);
      
      setPollingInterval(interval);
      // Cleanup function for this effect
      return () => {
        clearInterval(interval);
        setPollingInterval(null);
      };
    }
    // Ensure this effect cleans up if jobId changes or import completes
    return () => {
       if (pollingInterval) clearInterval(pollingInterval);
    }
  }, [jobId, importComplete]);

  const fetchResults = async (id) => {
    try {
      const resultsData = await getMigrationResults(id);
      
      if (resultsData) {
        // Set summary data
        setProcessedRecords(resultsData.processed || 0);
        setTotalRecords(resultsData.processed || 0);
        
        // Set detailed lists
        setSuccessList(resultsData.details?.success || []);
        setFailedList(resultsData.details?.failed || []);
        setInvalidList(resultsData.details?.invalid || []);
        setSkippedList(resultsData.details?.skipped || []);
        setUpdatedList(resultsData.details?.updated || []);
        
        // Set error report
        setErrorReport(resultsData.error_report || null);
        
        setImportComplete(true);
        setUploading(false);
        setJobSubmitted(false); // Reset submission status
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setUploadError("Failed to fetch import results. Please try again.");
      setUploading(false);
      setJobSubmitted(false); // Reset submission status
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Reset all relevant states
      setImportProgress(0);
      setSimulatedProgress(0);
      setJobSubmitted(false);
      setProcessedRecords(0);
      setImportComplete(false);
      setSuccessList([]);
      setFailedList([]);
      setInvalidList([]);
      setSkippedList([]);
      setUpdatedList([]);
      setJobId(null);
      setUploadError(null);
      setErrorReport(null);
      // Clear timers if any are running
      if (pollingInterval) clearInterval(pollingInterval);
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      setPollingInterval(null);
      simulationTimerRef.current = null;
    }
  };

  const startSimulation = () => {
    setSimulatedProgress(0);
    const duration = 60000; // 60 seconds
    const targetProgress = 90;
    const intervalTime = 100; // Update every 100ms
    const totalSteps = duration / intervalTime;
    const increment = targetProgress / totalSteps;

    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }

    simulationTimerRef.current = setInterval(() => {
      setSimulatedProgress(prev => {
        const nextProgress = prev + increment;
        if (nextProgress >= targetProgress) {
          clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
          return targetProgress;
        }
        return nextProgress;
      });
    }, intervalTime);
  };

  const stopSimulation = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
  };

  const startImport = async () => {
    if (!file) return;

    try {
      // Reset states for new upload
      setUploading(true);
      setImportComplete(false);
      setJobSubmitted(false);
      setUploadError(null);
      setJobId(null); // Clear previous job ID
      setImportProgress(0); // Reset real progress

      console.log("Starting import with file:", file.name);

      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setUploadError("Please upload a valid Excel file (.xlsx or .xls)");
        setUploading(false);
        return;
      }

      // Start the fake progress simulation
      startSimulation();

      // Upload the file and start the import process
      const response = await uploadMigrationFile(file);
      
      console.log("Upload response:", response);

      // Stop the simulation once API responds
      stopSimulation();

      if (response && response.jobId) {
        setJobId(response.jobId);
        setSimulatedProgress(100); // Visually complete the simulation
        setJobSubmitted(true); // Mark job as submitted

        // Note: We keep uploading = true because the actual job is still running
        // The real progress will now be updated by the polling useEffect
        
      } else {
        setJobSubmitted(false);
        throw new Error("No job ID received from server");
      }
    } catch (error) {
      console.error("Error starting import:", error);
      // Stop simulation on error
      stopSimulation();
      setSimulatedProgress(0); // Reset visual progress
      setJobSubmitted(false);

      let errorMessage = "Failed to start import";
      if (error.response && error.response.data) {
        errorMessage += ": " + (error.response.data.error?.message || "Server error");
      } else {
        errorMessage += ": " + (error.message || "Unknown error");
      }
      
      setUploadError(errorMessage);
      setUploading(false); // Stop the overall uploading state
    }
  };

  const downloadSampleTemplate = () => {
    try {
      fetchSampleTemplate();
    } catch (error) {
      // Fallback to client-side template generation if API fails
      const worksheet = XLSX.utils.json_to_sheet([
        {
          Name_Code: "TEST001",
          Add_Id: "ADD001",
          "Booking Details_Booking_Id": "BOOK20220315-0001",
          Receipt_Booking_Id: "REC001",
          "Receipt No": "R12345",
          MathOrMission: "Math",
          Actual_Name: "John Doe",
          Address1: "123 Main St",
          Address2: "Apt 4B",
          PO: "PO Box 123",
          Dist: "Kolkata",
          State: "West Bengal",
          Pin: "700001",
          Amount: "1000",
          Mode: "Cash",
          "Receipt Date": "03/15/2022",
          "DD/CH No": "",
          "DD/CH Date": "",
          Purpose: "General Donation",
          "PAN NO": "ABCDE1234F",
          "Bank Name": "",
          Name_Prefix: "Mr.",
          "Mobile No": "9876543210",
          "Landline No": "03322221111",
          "C/O": "",
          Country: "India"
        }
      ]);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Legacy Data");
      XLSX.writeFile(workbook, "legacy_data_template.xlsx");
    }
  };

  const renderValidationErrorDetails = () => {
    if (!errorReport || !errorReport.validation_errors || errorReport.validation_errors.length === 0) {
      return null;
    }

    return (
      <div className="validation-errors-section">
        <h4>Validation Issues</h4>
        <div className="validation-errors-table">
          <table>
            <thead>
              <tr>
                <th>Error Type</th>
                <th>Count</th>
                <th>Sample Values</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {getGroupedValidationErrors().map((group, index) => (
                <tr key={index}>
                  <td>{group.type}</td>
                  <td>{group.count}</td>
                  <td>{group.values}</td>
                  <td>{group.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Helper function to group validation errors by type
  const getGroupedValidationErrors = () => {
    if (!errorReport || !errorReport.validation_errors) return [];

    const errorMap = {};
    
    // Count errors by type
    errorReport.validation_errors.forEach(validationItem => {
      // Check if we have the enhanced error_details
      if (validationItem.error_details && Array.isArray(validationItem.error_details)) {
        validationItem.error_details.forEach(detail => {
          const errorKey = detail.field ? `${detail.field}: ${detail.message}` : detail.message;
          
          if (!errorMap[errorKey]) {
            errorMap[errorKey] = {
              count: 1,
              recommendations: new Set([validationItem.recommendation?.find(r => r.includes(detail.field)) || "Check and correct the data"]),
              examples: new Set(),
              values: new Set(detail.value ? [detail.value] : [])
            };
          } else {
            errorMap[errorKey].count++;
            if (validationItem.recommendation) {
              const rec = validationItem.recommendation.find(r => r.includes(detail.field));
              if (rec) errorMap[errorKey].recommendations.add(rec);
            }
            // Add the field value to examples
            if (detail.value && errorMap[errorKey].values.size < 5) {
              errorMap[errorKey].values.add(detail.value);
            }
          }
          
          // Add a few examples of records with this error
          if (errorMap[errorKey].examples.size < 3) {
            const exampleId = validationItem.add_id || validationItem.name_code;
            if (exampleId) errorMap[errorKey].examples.add(exampleId);
          }
        });
      } 
      // Fallback to old format if error_details is not available
      else if (validationItem.errors && Array.isArray(validationItem.errors)) {
        validationItem.errors.forEach(error => {
          if (!errorMap[error]) {
            errorMap[error] = {
              count: 1,
              recommendations: new Set([validationItem.recommendation?.find(r => r.includes(error.split(' ')[0])) || "Check and correct the data"]),
              examples: new Set(),
              values: new Set()
            };
          } else {
            errorMap[error].count++;
            if (validationItem.recommendation) {
              const rec = validationItem.recommendation.find(r => r.includes(error.split(' ')[0]));
              if (rec) errorMap[error].recommendations.add(rec);
            }
          }
          
          // Add a few examples
          if (errorMap[error].examples.size < 3) {
            const exampleId = validationItem.add_id || validationItem.name_code || 
              invalidList.find(item => 
                item.errors && Array.isArray(item.errors) && 
                item.errors.includes(error))?.add_id;
            
            if (exampleId) errorMap[error].examples.add(exampleId);
          }
        });
      }
    });
    
    // Convert to array
    return Object.entries(errorMap).map(([type, data]) => ({
      type,
      count: data.count,
      examples: Array.from(data.examples),
      values: Array.from(data.values).slice(0, 3).join(", "), // Include sample values
      recommendation: Array.from(data.recommendations).join("; ")
    }));
  };

  // Determine which progress value and text to display
  const displayProgress = jobSubmitted ? importProgress : simulatedProgress;
  const progressText = jobSubmitted 
    ? `Processing in background... ${Math.round(importProgress)}% complete`
    : `Uploading and preparing... ${Math.round(simulatedProgress)}% complete`;

  return (
    <div className="import-users-container">
      <h3 className="import-title">Import Legacy Data</h3>
      <p className="import-description">
        Upload an Excel file to import historical guest records, donations, and bookings.
        <br />
        <small>Note: The unique identifier for each record is the <strong>Add_Id</strong> field.</small>
      </p>

      <div className="import-panel">
        <div className="upload-section">
          <div className="file-selection">
            <input
              type="file"
              id="file-upload-legacy"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
            <label htmlFor="file-upload-legacy" className="file-label">
              {file ? file.name : "Choose Excel File"}
            </label>
            <button
              className="import-button"
              onClick={startImport}
              disabled={!file || uploading}
            >
              {uploading ? (jobSubmitted ? "Processing..." : "Uploading...") : "Import Data"}
            </button>
          </div>

          <div className="template-section">
            <p>Not sure about the format?</p>
            <button className="template-button" onClick={downloadSampleTemplate}>
              Download Sample Template
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="error-message alert-error">
            <span>{uploadError}</span>
          </div>
        )}

        {uploading && !importComplete && (
          <div className="progress-section">
            <div className="progress-info">
              <span>{progressText}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${displayProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {importComplete && (
        <div className="import-results">
          <div className="results-summary">
            <div className="result-card success">
              <h4>Successfully Imported</h4>
              <span className="count">{successList.length}</span>
            </div>
            <div className="result-card warning">
              <h4>Updated Records</h4>
              <span className="count">{updatedList.length}</span>
            </div>
            <div className="result-card error">
              <h4>Failed</h4>
              <span className="count">{failedList.length}</span>
            </div>
            <div className="result-card info">
              <h4>Invalid Records</h4>
              <span className="count">{invalidList.length}</span>
            </div>
            <div className="result-card notice">
              <h4>Skipped Records</h4>
              <span className="count">{skippedList.length}</span>
            </div>
          </div>

          {renderValidationErrorDetails()}

          {invalidList.length > 0 && (
            <div className="errors-section">
              <h4>Invalid Records</h4>
              <p className="help-text">These records couldn't be imported due to validation errors. Fix the issues and try again.</p>
              <div className="errors-table">
                <table>
                  <thead>
                    <tr>
                      <th>Add_Id</th>
                      <th>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invalidList.slice(0, 20).map((item, index) => (
                      <tr key={index}>
                        <td>{item.add_id}</td>
                        <td>
                          {Array.isArray(item.errors) ? (
                            <ul className="error-list">
                              {item.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          ) : (
                            item.errors
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {invalidList.length > 20 && (
                  <p className="more-records">
                    + {invalidList.length - 20} more records
                  </p>
                )}
              </div>
            </div>
          )}

          {skippedList.length > 0 && (
            <div className="skipped-section">
              <h4>Skipped Records</h4>
              <p className="help-text">These records already exist in the system and were skipped.</p>
              <div className="skipped-table">
                <table>
                  <thead>
                    <tr>
                      <th>Add_Id</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skippedList.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td>{item.add_id}</td>
                        <td>{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {skippedList.length > 10 && (
                  <p className="more-records">
                    + {skippedList.length - 10} more records
                  </p>
                )}
              </div>
            </div>
          )}

          {updatedList.length > 0 && (
            <div className="updated-section">
              <h4>Updated Records</h4>
              <p className="help-text">New transactions added to existing records.</p>
              <div className="updated-table">
                <table>
                  <thead>
                    <tr>
                      <th>Add_Id</th>
                      <th>Update Type</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedList.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td>{item.add_id}</td>
                        <td>{item.type}</td>
                        <td>
                          {item.receipt_no ? `Receipt: ${item.receipt_no}` : ''}
                          {item.booking_id ? `Booking: ${item.booking_id}` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {updatedList.length > 10 && (
                  <p className="more-records">
                    + {updatedList.length - 10} more records
                  </p>
                )}
              </div>
            </div>
          )}

          {failedList.length > 0 && (
            <div className="failed-section">
              <h4>Failed Imports</h4>
              <p className="help-text">These records failed during processing.</p>
              <div className="failed-table">
                <table>
                  <thead>
                    <tr>
                      <th>Add_Id</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedList.map((item, index) => (
                      <tr key={index}>
                        <td>{item.add_id}</td>
                        <td>{item.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportLegacyData; 