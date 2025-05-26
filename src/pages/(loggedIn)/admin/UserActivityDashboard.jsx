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
        setAnalytics(response);
      } else {
        throw new Error(response.error || "Failed to fetch analytics data");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render daily activity chart from timeSeriesData
  const renderDailyActivityChart = () => {
    if (!analytics || !analytics.timeSeriesData || analytics.timeSeriesData.length === 0) {
      return <div className="chart-placeholder">No activity data available</div>;
    }

    const maxValue = Math.max(...analytics.timeSeriesData.map(day => day.count));

    return (
      <div className="daily-activity-chart">
        {analytics.timeSeriesData.map((day) => (
          <div key={day.date} className="chart-day">
            <div className="chart-bars">
              <div 
                className="chart-bar other-bar" 
                style={{ height: `${(day.count / (maxValue || 1)) * 100}%` }}
                title={`${day.count} actions on ${day.date}`}
              ></div>
            </div>
            <div className="chart-label">{day.date.split('-')[2]}</div>
          </div>
        ))}
      </div>
    );
  };

  // Helper to render action types chart
  const renderActionTypeChart = () => {
    if (!analytics || !analytics.activityByAction || analytics.activityByAction.length === 0) {
      return <div className="chart-placeholder">No action data available</div>;
    }

    const totalActions = analytics.totalActivityCount || 
      analytics.activityByAction.reduce((sum, action) => sum + action.count, 0);
    
    return (
      <div className="device-type-chart">
        <div className="pie-chart-container">
          {analytics.activityByAction.map((action, index) => {
            const percentage = (action.count / totalActions) * 100;
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#607D8B'];
            const color = colors[index % colors.length];
            
            return (
              <div 
                key={action.action}
                className="pie-segment"
                style={{
                  backgroundColor: color,
                  transform: `rotate(${index * 60}deg) translate(0, 50%)`,
                  transformOrigin: "center",
                  opacity: 0.8,
                  width: `${Math.max(10, percentage)}%`,
                  height: `${Math.max(10, percentage)}%`,
                }}
                title={`${action.action}: ${action.count} (${percentage.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>
        <div className="pie-legend">
          {analytics.activityByAction.map((action, index) => {
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#607D8B'];
            const color = colors[index % colors.length];
            const percentage = (action.count / totalActions) * 100;
            
            return (
              <div key={action.action} className="legend-item">
                <div className="color-box" style={{ backgroundColor: color }}></div>
                <div className="legend-label">{action.action}: {percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper to render top users
  const renderTopUsers = () => {
    if (!analytics || !analytics.activityByUser || analytics.activityByUser.length === 0) {
      return <div className="chart-placeholder">No user data available</div>;
    }

    const maxCount = Math.max(...analytics.activityByUser.map(user => user.count));
    
    return (
      <div className="top-users-chart">
        {analytics.activityByUser.map(user => (
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

  // Helper to render activity period
  const renderActivityPeriod = () => {
    if (!analytics || !analytics.period) {
      return <div className="chart-placeholder">No period data available</div>;
    }

    const startDate = new Date(analytics.period.start).toLocaleDateString();
    const endDate = new Date(analytics.period.end).toLocaleDateString();

    return (
      <div className="suspicious-activities-list">
        <div className="suspicious-activity-item severity-low">
          <div className="activity-icon">ℹ️</div>
          <div className="activity-content">
            <div className="activity-message">Data Period: {startDate} to {endDate}</div>
            <div className="activity-details">
              <span className="activity-timestamp">
                {analytics.uniqueUsers} unique users during this period
              </span>
            </div>
          </div>
        </div>
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
                  <div className="metric-value">{analytics.totalActivityCount || 0}</div>
                  <div className="metric-label">Total Activities</div>
                </div>
                <div className="metric-card warning">
                  <div className="metric-value">
                    {analytics.activityByAction?.find(a => a.action === "unknown.error")?.count || 0}
                  </div>
                  <div className="metric-label">Errors</div>
                </div>
                <div className="metric-card info">
                  <div className="metric-value">{analytics.uniqueUsers || 0}</div>
                  <div className="metric-label">Unique Users</div>
                </div>
              </div>
              
              {/* Charts row */}
              <div className="charts-row">
                <div className="chart-card">
                  <h3>Daily Activity</h3>
                  {renderDailyActivityChart()}
                  <div className="chart-legend">
                    <div className="legend-item">
                      <div className="color-box other-bar"></div>
                      <div className="legend-label">All Activities</div>
                    </div>
                  </div>
                </div>
                
                <div className="chart-card">
                  <h3>Activity Types</h3>
                  {renderActionTypeChart()}
                </div>
              </div>
              
              {/* Additional insights row */}
              <div className="insights-row">
                <div className="chart-card">
                  <h3>Top Active Users</h3>
                  {renderTopUsers()}
                </div>
                
                <div className="chart-card suspicious">
                  <h3>Activity Period</h3>
                  {renderActivityPeriod()}
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
