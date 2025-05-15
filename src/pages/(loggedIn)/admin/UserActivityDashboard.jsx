import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../../store/authStore";
import { getUserActivityAnalytics } from "../../../../services/userActivityLog";
import { ROLES } from "../../../constants/permissions";
import "./UserActivityLogs.scss";

const UserActivityDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { hasRole } = useAuthStore();

  // Check if user is super admin
  const isSuperAdmin = hasRole(ROLES.SUPER_ADMIN);

  // Fetch analytics on component mount
  useEffect(() => {
    if (!isSuperAdmin) {
      setError("You do not have permission to view this page");
      setLoading(false);
      return;
    }

    fetchAnalytics();
  }, [isSuperAdmin]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getUserActivityAnalytics();
      
      if (response.success) {
        setAnalytics(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch analytics data");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render daily activity chart
  const renderDailyActivityChart = () => {
    if (!analytics || !analytics.dailyActivity || analytics.dailyActivity.length === 0) {
      return <div className="chart-placeholder">No activity data available</div>;
    }

    const maxValue = Math.max(
      ...analytics.dailyActivity.map(day => 
        Math.max(day.logins, day.failedLogins, day.otherActions)
      )
    );

    return (
      <div className="daily-activity-chart">
        {analytics.dailyActivity.map((day, index) => (
          <div key={day.date} className="chart-day">
            <div className="chart-bars">
              <div 
                className="chart-bar success-bar" 
                style={{ height: `${(day.logins / (maxValue || 1)) * 100}%` }}
                title={`${day.logins} successful logins`}
              ></div>
              <div 
                className="chart-bar failed-bar" 
                style={{ height: `${(day.failedLogins / (maxValue || 1)) * 100}%` }}
                title={`${day.failedLogins} failed logins`}
              ></div>
              <div 
                className="chart-bar other-bar" 
                style={{ height: `${(day.otherActions / (maxValue || 1)) * 100}%` }}
                title={`${day.otherActions} other actions`}
              ></div>
            </div>
            <div className="chart-label">{day.date.split('-')[2]}</div>
          </div>
        ))}
      </div>
    );
  };

  // Helper to render device type pie chart
  const renderDeviceTypeChart = () => {
    if (!analytics || !analytics.deviceTypes || analytics.deviceTypes.length === 0) {
      return <div className="chart-placeholder">No device data available</div>;
    }

    const totalDevices = analytics.deviceTypes.reduce((sum, device) => sum + device.count, 0);
    
    return (
      <div className="device-type-chart">
        <div className="pie-chart-container">
          {analytics.deviceTypes.map((device, index) => {
            const percentage = (device.count / totalDevices) * 100;
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#607D8B'];
            const color = colors[index % colors.length];
            
            return (
              <div 
                key={device.name}
                className="pie-segment"
                style={{
                  backgroundColor: color,
                  transform: `rotate(${index * 60}deg) translate(0, 50%)`,
                  transformOrigin: "center",
                  opacity: 0.8,
                  width: `${Math.max(10, percentage)}%`,
                  height: `${Math.max(10, percentage)}%`,
                }}
                title={`${device.name}: ${device.count} (${percentage.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>
        <div className="pie-legend">
          {analytics.deviceTypes.map((device, index) => {
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#607D8B'];
            const color = colors[index % colors.length];
            const percentage = (device.count / totalDevices) * 100;
            
            return (
              <div key={device.name} className="legend-item">
                <div className="color-box" style={{ backgroundColor: color }}></div>
                <div className="legend-label">{device.name}: {percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper to render top users
  const renderTopUsers = () => {
    if (!analytics || !analytics.topUsers || analytics.topUsers.length === 0) {
      return <div className="chart-placeholder">No user data available</div>;
    }

    const maxCount = Math.max(...analytics.topUsers.map(user => user.count));
    
    return (
      <div className="top-users-chart">
        {analytics.topUsers.map(user => (
          <div key={user.username} className="user-bar-container">
            <div className="user-label">{user.username}</div>
            <div className="user-bar-wrapper">
              <div 
                className="user-bar" 
                style={{ width: `${(user.count / maxCount) * 100}%` }}
                title={`${user.count} activities`}
              ></div>
              <span className="user-count">{user.count}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper to render suspicious activities
  const renderSuspiciousActivities = () => {
    if (!analytics || !analytics.suspiciousActivities || analytics.suspiciousActivities.length === 0) {
      return <div className="suspicious-placeholder">No suspicious activities detected</div>;
    }

    return (
      <div className="suspicious-activities-list">
        {analytics.suspiciousActivities.map((activity, index) => {
          const severityClass = 
            activity.severity === 'high' ? 'severity-high' :
            activity.severity === 'medium' ? 'severity-medium' : 'severity-low';
          
          return (
            <div key={index} className={`suspicious-activity-item ${severityClass}`}>
              <div className="activity-icon">
                {activity.severity === 'high' ? '⚠️' : 
                 activity.severity === 'medium' ? '⚠' : 'ℹ️'}
              </div>
              <div className="activity-content">
                <div className="activity-message">{activity.message}</div>
                <div className="activity-details">
                  {activity.timestamp && (
                    <span className="activity-timestamp">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  )}
                  <span className="activity-severity">
                    Severity: {activity.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // If not super admin
  if (!isSuperAdmin) {
    return (
      <div className="user-activity-logs-container">
        <div className="card">
          <div className="card-header">
            <h2>Access Denied</h2>
          </div>
          <div className="card-body">
            <p>You do not have permission to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-activity-logs-container">
      <div className="card">
        <div className="card-header">
          <h2>User Activity Dashboard</h2>
          <p className="header-description">
            Analytics and insights on user activity and security
          </p>
        </div>
        
        <div className="card-body">
          {loading ? (
            <div className="loading-container">
              <p>Loading analytics data...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Error: {error}</p>
              <button onClick={fetchAnalytics} className="btn btn-primary">Retry</button>
            </div>
          ) : (
            <div className="analytics-dashboard">
              {/* Summary metrics */}
              <div className="summary-metrics">
                <div className="metric-card">
                  <div className="metric-value">{analytics.totalLogins || 0}</div>
                  <div className="metric-label">Total Logins</div>
                </div>
                <div className="metric-card warning">
                  <div className="metric-value">{analytics.totalFailedLogins || 0}</div>
                  <div className="metric-label">Failed Logins</div>
                </div>
                <div className="metric-card info">
                  <div className="metric-value">{analytics.totalPasswordChanges || 0}</div>
                  <div className="metric-label">Password Changes</div>
                </div>
              </div>
              
              {/* Charts row */}
              <div className="charts-row">
                <div className="chart-card">
                  <h3>Daily Activity</h3>
                  {renderDailyActivityChart()}
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="color-box success-bar"></div>
                      <div className="legend-label">Successful Logins</div>
                    </div>
                    <div className="legend-item">
                      <div className="color-box failed-bar"></div>
                      <div className="legend-label">Failed Logins</div>
                    </div>
                    <div className="legend-item">
                      <div className="color-box other-bar"></div>
                      <div className="legend-label">Other Activities</div>
                    </div>
                  </div>
                </div>
                
                <div className="chart-card">
                  <h3>Device Types</h3>
                  {renderDeviceTypeChart()}
                </div>
              </div>
              
              {/* Additional insights row */}
              <div className="insights-row">
                <div className="chart-card">
                  <h3>Top Active Users</h3>
                  {renderTopUsers()}
                </div>
                
                <div className="chart-card suspicious">
                  <h3>Suspicious Activities</h3>
                  {renderSuspiciousActivities()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityDashboard;
