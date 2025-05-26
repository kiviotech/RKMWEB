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
      setError(null);
      
      console.log('Fetching activity logs with params:', {
        page, pageSize, sortBy, sortOrder, 
        filters: Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value && value.trim() !== "")
        )
      });
      
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
      console.error('Error fetching logs:', err);
      setError(err.message || "Failed to fetch activity logs");
      setLogs([]);
      setTotalPages(1);
      setTotalRecords(0);
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
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  const getActionBadgeClass = (action) => {
    if (!action) return "badge-secondary";
    
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
                  <option value="">All Actions</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="password">Password</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="export">Export</option>
                  <option value="view">View</option>
                </select>
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={fetchLogs}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="alert alert-danger mt-3">
              <strong>Error:</strong> {error}
              <p>Please check the API connection and try again.</p>
              <button 
                className="btn btn-primary btn-sm mt-2"
                onClick={fetchLogs}
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="text-center mt-4 mb-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          {/* Records count */}
          {!loading && !error && (
            <div className="records-info mb-3">
              <span>{totalRecords} records found</span>
            </div>
          )}
          
          {/* Activity logs table */}
          {!loading && !error && (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th onClick={() => handleSortChange("timestamp")}>
                        Timestamp
                        {sortBy === "timestamp" && (
                          <span className={`sort-arrow ${sortOrder === "desc" ? "down" : "up"}`}>
                            {sortOrder === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange("username")}>
                        User
                        {sortBy === "username" && (
                          <span className={`sort-arrow ${sortOrder === "desc" ? "down" : "up"}`}>
                            {sortOrder === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange("action")}>
                        Action
                        {sortBy === "action" && (
                          <span className={`sort-arrow ${sortOrder === "desc" ? "down" : "up"}`}>
                            {sortOrder === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </th>
                      <th onClick={() => handleSortChange("ipAddress")}>
                        IP Address
                        {sortBy === "ipAddress" && (
                          <span className={`sort-arrow ${sortOrder === "desc" ? "down" : "up"}`}>
                            {sortOrder === "desc" ? "▼" : "▲"}
                          </span>
                        )}
                      </th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs && logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log.id || `log-${Math.random()}`}>
                          <td>{formatDate(log.attributes?.timestamp || log.timestamp)}</td>
                          <td>
                            {log.attributes?.username || log.username || "Anonymous"}
                            {(log.attributes?.userRole || log.userRole) && (
                              <span className="badge bg-info ms-2 role-badge">
                                {log.attributes?.userRole || log.userRole}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${getActionBadgeClass(log.attributes?.action || log.action)}`}>
                              {getActionLabel(log.attributes?.action || log.action)}
                            </span>
                          </td>
                          <td>{log.attributes?.ipAddress || log.ipAddress || "Unknown"}</td>
                          <td>{log.attributes?.notes || log.notes || ""}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No activity logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages).keys()].map((i) => (
                      <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityLogs;
