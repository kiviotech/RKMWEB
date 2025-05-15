import React from "react";
import "./DashboardCard.scss";

const DashboardCard = ({ 
  title, 
  icon, 
  primaryMetric, 
  metrics, 
  chart, 
  table, 
  footer,
  fullWidth = false
}) => {
  // Function to get icon markup based on icon name
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'donation':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V6" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V22" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.93 4.93L7.76 7.76" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.24 16.24L19.07 19.07" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H6" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 12H22" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.93 19.07L7.76 16.24" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.24 7.76L19.07 4.93" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'deeksha':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'coupon':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'room':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 17H15" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'recent':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.05 11C3.27151 9.16406 4.09525 7.45908 5.39977 6.15809C6.7043 4.85709 8.41015 4.03759 10.2462 3.82097C12.0822 3.60436 13.9397 4.00335 15.5208 4.95859C17.1019 5.91383 18.3142 7.36826 18.95 9.09997M20.95 13C20.7265 14.8484 19.8959 16.5652 18.5809 17.8738C17.266 19.1823 15.5462 20.0034 13.6974 20.2124C11.8485 20.4214 9.98244 20.0094 8.40004 19.0374C6.81765 18.0654 5.60004 16.5934 5.00004 14.85" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15L5 13L7 15" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 9L19 11L17 9" stroke="#ea7704" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Function to render the chart placeholder
  // In a real implementation, you would use a charting library like Chart.js or recharts
  const renderChart = () => {
    if (!chart) return null;

    return (
      <div className="dashboard-card-chart">
        <div className="chart-placeholder">
          {chart.type === 'doughnut' && (
            <div className="doughnut-chart">
              <div className="doughnut-inner">
                <div className="doughnut-label">
                  <span>{chart.data.reduce((a, b) => a + b, 0)}</span>
                  <span className="chart-label">Total</span>
                </div>
              </div>
              <div className="chart-legend">
                {chart.labels.map((label, index) => (
                  <div key={index} className="legend-item">
                    <span className={`legend-color color-${index}`}></span>
                    <span className="legend-label">{label}: {chart.data[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {chart.type === 'line' && (
            <div className="line-chart">
              <div className="chart-bars">
                {chart.data.map((value, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${Math.min(100, (value / Math.max(...chart.data)) * 100)}%` 
                      }}
                    ></div>
                    <div className="chart-label">{chart.labels[index]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {chart.type === 'bar' && (
            <div className="bar-chart">
              <div className="chart-bars">
                {chart.data.map((value, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${Math.min(100, (value / Math.max(...chart.data)) * 100)}%` 
                      }}
                    ></div>
                    <div className="chart-label">{chart.labels[index]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {chart.type === 'pie' && (
            <div className="pie-chart">
              <div className="pie-chart-placeholder"></div>
              <div className="chart-legend">
                {chart.labels.map((label, index) => (
                  <div key={index} className="legend-item">
                    <span className={`legend-color color-${index}`}></span>
                    <span className="legend-label">{label}: {chart.data[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Function to render the table
  const renderTable = () => {
    if (!table) return null;

    return (
      <div className="dashboard-card-table">
        <table>
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`dashboard-card ${fullWidth ? 'full-width' : ''}`}>
      <div className="dashboard-card-header">
        <div className="card-title">
          {icon && <span className="card-icon">{getIcon(icon)}</span>}
          <h3>{title}</h3>
        </div>
        {primaryMetric && (
          <div className="primary-metric">
            <span className="metric-label">{primaryMetric.label}</span>
            <span className="metric-value">{primaryMetric.value}</span>
          </div>
        )}
      </div>
      
      {metrics && metrics.length > 0 && (
        <div className="dashboard-card-metrics">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-item">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-value">{metric.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {renderChart()}
      {renderTable()}
      
      {footer && (
        <div className="dashboard-card-footer">
          <button onClick={footer.action}>{footer.label}</button>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
