import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../../store/authStore";
import { getUserActivityLogs } from "../../../../services/userActivityLog";
import { ROLES } from "../../../constants/permissions";
import "./UserActivityLogs.scss";

const UserActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    action: "",
    username: "",
    ipAddress: ""
  });
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  const { hasRole } = useAuthStore();

  // Check if user is super admin
  const isSuperAdmin = hasRole(ROLES.SUPER_ADMIN);

  // Fetch logs on component mount and when filters/pagination change
  useEffect(() => {
    if (!isSuperAdmin) {
      setError("You do not have permission to view this page");
      setLoading(false);
      return;
    }

    fetchLogs();
  }, [page, pageSize, sortBy, sortOrder, filters, isSuperAdmin]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Get all audit logs - we'll include both user activity and other logs
      const response = await getUserActivityLogs({
        page,
        pageSize,
        sortBy,
        sortOrder,
        filters: {
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value && value.trim() !== "")
          )
        }
      });

      if (response.success) {
        // Set the logs and update pagination
        setLogs(response.data);
        setTotalPages(Math.ceil(response.total / pageSize));
        setTotalRecords(response.total);
        
        console.log('[ACTIVITY LOGS] Fetched logs:', response.data.length);
      } else {
        throw new Error(response.error || "Failed to fetch activity logs");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const SORT_FIELD_MAP = {
    timestamp: "timestamp",
    username: "username",
    action: "action",
    ipAddress: "ipAddress"
  };

  const handleSortChange = (field) => {
    const backendField = SORT_FIELD_MAP[field] || field;
    if (sortBy === backendField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(backendField);
      setSortOrder("desc");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getActionBadgeClass = (action) => {
    if (action.includes("login")) {
      return "badge-success";
    } else if (action.includes("password")) {
      return "badge-info";
    } else if (action.includes("donation")) {
      return "badge-warning";
    } else {
      return "badge-secondary";
    }
  };

  const getActionLabel = (action) => {
    if (!action) return "Unknown Action";
    
    switch (action) {
      case "user.login":
        return "Login";
      case "user.logout":
        return "Logout";
      case "user.password_change":
        return "Password Change";
      case "donation.create":
        return "Donation Created";
      case "donation.update":
        return "Donation Updated";
      case "auth.login":
        return "User Login";
      default:
        // Handle different formats of action strings
        return action
          .replace(/\./g, " ")
          .replace(/_/g, " ")
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

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
          <h2>User Activity Logs</h2>
          <p className="header-description">
            Track all user activities including logins, password changes, and system usage
          </p>
        </div>
        
        <div className="card-body">
          {/* Filters */}
          <div className="filters-container">
            <div className="filter-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Filter by username"
                  value={filters.username}
                  onChange={(e) => handleFilterChange("username", e.target.value)}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Filter by IP address"
                  value={filters.ipAddress}
                  onChange={(e) => handleFilterChange("ipAddress", e.target.value)}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  className="form-select"
                >
                  <option value="">All actions</option>
                  <option value="user.login">Login</option>
                  <option value="user.logout">Logout</option>
                  <option value="user.password_change">Password Change</option>
                  <option value="donation.create">Donation Created</option>
                  <option value="donation.update">Donation Updated</option>
                </select>
              </div>
              
              <button 
                onClick={() => {
                  setFilters({
                    action: "",
                    username: "",
                    ipAddress: ""
                  });
                  setPage(1);
                }}
                className="btn btn-outline-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Activity Logs Table */}
          {loading ? (
            <div className="loading-container">
              <p>Loading activity logs...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Error: {error}</p>
              <button onClick={fetchLogs} className="btn btn-primary">Retry</button>
            </div>
          ) : logs.length === 0 ? (
            <div className="empty-container">
              <p>No activity logs found</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSortChange("timestamp")}
                      >
                        Timestamp {sortBy === SORT_FIELD_MAP.timestamp && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSortChange("username")}
                      >
                        User {sortBy === SORT_FIELD_MAP.username && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSortChange("action")}
                      >
                        Action {sortBy === SORT_FIELD_MAP.action && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSortChange("ipAddress")}
                      >
                        IP Address {sortBy === SORT_FIELD_MAP.ipAddress && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th>User Agent</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const attr = log.attributes || {};
                      // Extract timestamp from multiple possible locations
                      const timestamp = attr.timestamp || 
                                       (attr.details && attr.details.timestamp) || 
                                       new Date().toISOString();
                      
                      // Extract username from multiple possible locations
                      const username = attr.username || 
                                      attr.userId || 
                                      (attr.user && attr.user.username) || 
                                      'Unknown';
                      
                      // Extract role information
                      const userRole = attr.userRole || 
                                      (attr.user && attr.user.role) || 
                                      '';
                      
                      // Extract IP address
                      const ipAddress = attr.ipAddress || 
                                      (attr.details && attr.details.ipAddress) || 
                                      '0.0.0.0';
                      
                      // Extract user agent
                      const userAgent = attr.userAgent || 
                                      (attr.details && attr.details.userAgent) || 
                                      (attr.details && attr.details.browserInfo) || 
                                      'Unknown';
                      
                      // Get notes or details
                      const notes = attr.notes || '';
                      const details = attr.details || {};
                      
                      return (
                        <tr key={log.id}>
                          <td>{formatDate(timestamp)}</td>
                          <td>
                            {username}
                            {userRole && (
                              <span className="badge badge-light ml-2">
                                {userRole}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${getActionBadgeClass(attr.action)}`}>
                              {getActionLabel(attr.action)}
                            </span>
                          </td>
                          <td>{ipAddress}</td>
                          <td>
                            <div className="user-agent-cell" title={userAgent}>
                              {userAgent ? userAgent.substring(0, 30) + "..." : "Unknown"}
                            </div>
                          </td>
                          <td>
                            {details && typeof details === 'object' 
                              ? Object.entries(details)
                                  .filter(([key]) => key !== 'timestamp' && key !== 'userAgent' && key !== 'ipAddress')
                                  .map(([key, value]) => (
                                    <div key={key} className="log-detail-item">
                                      <strong>{key}:</strong> {typeof value === 'boolean' 
                                        ? (value ? 'Yes' : 'No') 
                                        : (typeof value === 'object' 
                                            ? JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '')
                                            : String(value))}
                                    </div>
                                  ))
                              : notes || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {logs.length} of {totalRecords} records
                </div>
                <div className="pagination-controls">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </button>
                  
                  <span className="page-indicator">
                    Page {page} of {totalPages}
                  </span>
                  
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                  
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="form-select form-select-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityLogs;
