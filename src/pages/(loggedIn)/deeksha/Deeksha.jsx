import React from 'react';
import './Deekha.scss';

const DeekhaPage = () => {
    const deekhaData = [
        { name: 'John Doe', date: '2023-10-01', phone: '123-456-7890' },
        { name: 'Jane Smith', date: '2023-09-20', phone: '098-765-4321' },
        { name: 'David Brown', date: '2023-08-15', phone: '555-123-4567' },
        // Add more rows as needed
      ];
    
      const handleExport = (row) => {
        const csvData = `${row.name},${row.date},${row.phone}`;
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${row.name}_deekha_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    
      return (
        <div className="deekha-page">
          <h1>Deekha Details</h1>
          <table className="deekha-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Deekha Date</th>
                <th>Phone Number</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {deekhaData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.date}</td>
                  <td>{row.phone}</td>
                  <td>
                    <button
                      className="export-button"
                      onClick={() => handleExport(row)}
                    >
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
    
    export default DeekhaPage;