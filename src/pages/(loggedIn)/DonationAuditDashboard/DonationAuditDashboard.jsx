import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { FiSearch, FiFileText, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuthStore } from '../../../../store/authStore';
import { getAuditLogs } from '../../../../services/auditLog';
import './DonationAuditDashboard.scss';

const DonationAuditDashboard = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    username: '',
    date: null,
    donationId: '',
  });
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const user = useAuthStore((state) => state.user);

  // Check if user is super-admin
  useEffect(() => {
    const userRole = user?.role?.type || user?.user_role;
    if (userRole !== 'super-admin') {
      // Redirect unauthorized users
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Fetch logs only once on component mount
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Apply client-side filters to the full dataset
  const applyFilters = useCallback(() => {
    let result = [...auditLogs];
    
    // Filter by username if specified
    if (filters.username) {
      result = result.filter(log => 
        log.username && log.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }
    
    // Filter by donation ID if specified
    if (filters.donationId) {
      result = result.filter(log => 
        log.donationId && log.donationId.toString() === filters.donationId
      );
    }
    
    // Filter by date if specified
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filterDate.setHours(0, 0, 0, 0);
      const filterDateEnd = new Date(filters.date);
      filterDateEnd.setHours(23, 59, 59, 999);
      
      result = result.filter(log => {
        try {
          const logTimestamp = log.attributes?.timestamp || log.timestamp;
          if (!logTimestamp) return false;
          
          const logDate = new Date(logTimestamp);
          if (isNaN(logDate.getTime())) return false;
          
          return logDate >= filterDate && logDate <= filterDateEnd;
        } catch (error) {
          console.error('Error filtering by date:', error);
          return false;
        }
      });
    }
    
    // Update filtered logs and pagination
    setFilteredLogs(result);
    
    // Update total count for pagination
    setPagination({
      ...pagination,
      total: result.length
    });
    
    console.log(`Applied filters: ${result.length} logs matched (showing ${Math.min(pagination.pageSize, result.length)} per page)`); 
  }, [auditLogs, filters, pagination.current, pagination.pageSize]);
  
  // Run filter whenever filters or audit logs change
  useEffect(() => {
    applyFilters();
  }, [filters, auditLogs, applyFilters]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      console.log('Fetching all audit logs');
      const response = await getAuditLogs();

      if (response.success) {
        // Set the full dataset of audit logs
        // Handle both formats - data might be already extracted or still in Strapi's response format
        const logsData = response.data || [];
        
        // Check if the data is in the Strapi format with attributes
        const processedLogs = Array.isArray(logsData) ? logsData.map(log => {
          // If the log already has direct properties, use it as-is
          if (log.timestamp) return log;
          
          // Otherwise extract from Strapi's attributes structure
          if (log.attributes) {
            // Create a flattened object with both ID and attributes
            return {
              id: log.id,
              ...log.attributes,
              // Parse JSON strings if needed
              metadata: log.attributes.metadata ? JSON.parse(log.attributes.metadata) : null,
              changes: log.attributes.changes || null
            };
          }
          return log;
        }) : [];
        
        setAuditLogs(processedLogs);
        console.log('Audit logs fetched successfully:', processedLogs.length, 'logs');
      } else {
        console.error('Failed to fetch audit logs:', response.error);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    // Only update pagination, don't refetch
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleFilter = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, current: 1 }); // Reset to first page on filter change
  };

  const showDetails = (log) => {
    setSelectedLog(log);
    setDetailsVisible(true);
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'create':
        return <span className="tag tag-green">Created</span>;
      case 'update':
        return <span className="tag tag-blue">Updated</span>;
      case 'delete':
        return <span className="tag tag-red">Deleted</span>;
      default:
        return <span className="tag tag-default">{action}</span>;
    }
  };

  const renderChanges = (changes) => {
    if (!changes || !Array.isArray(changes)) return 'No changes recorded';

    return (
      <table className="changes-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Old Value</th>
            <th>New Value</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change, index) => (
            <tr key={index}>
              <td><strong>{change.field}</strong></td>
              <td>{change.oldValue === undefined || change.oldValue === null ? <em>None</em> : change.oldValue}</td>
              <td>{change.newValue === undefined || change.newValue === null ? <em>None</em> : change.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Helper function to safely format dates
  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return format(date, 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Error';
    }
  };
  
  // Column definitions for our custom table
  const columns = [
    {
      id: 'timestamp',
      header: 'Date & Time',
      accessor: (record) => safeFormatDate(record.attributes?.timestamp || record.timestamp),
    },
    {
      id: 'username',
      header: 'User',
      accessor: (record) => (
        <span title={`User ID: ${record.userId}`}>{record.username}</span>
      ),
    },
    {
      id: 'donationId',
      header: 'Donation ID',
      accessor: (record) => record.donationId,
    },
    {
      id: 'action',
      header: 'Action',
      accessor: (record) => getActionLabel(record.action),
    },
    {
      id: 'changes',
      header: 'Changes',
      accessor: (record) => {
        try {
          const changes = record.changes || record.metadata?.changes;
          if (!changes) return <span>No details</span>;
          
          let parsedChanges;
          if (typeof changes === 'string') {
            try {
              parsedChanges = JSON.parse(changes);
            } catch (e) {
              return <span>Invalid format</span>;
            }
          } else {
            parsedChanges = changes;
          }
          
          return (
            <span title={JSON.stringify(parsedChanges) || 'No details available'}>
              {Array.isArray(parsedChanges) ? `${parsedChanges.length} changes` : 'Details available'}
            </span>
          );
        } catch (error) {
          console.error('Error rendering changes:', error);
          return <span>Error</span>;
        }
      },
    },
    {
      id: 'details',
      header: 'Details',
      accessor: (record) => (
        <button
          className="icon-button"
          onClick={() => showDetails(record)}
        >
          <FiFileText />
        </button>
      ),
    },
  ];

  const resetFilters = () => {
    setFilters({
      username: '',
      date: null,
      donationId: '',
    });
    setPagination({
      ...pagination,
      current: 1,
    });
    // Will automatically update filtered results via the effect
  };

  // Calculate the current page slice of filtered logs
  const currentPageLogs = filteredLogs
    .slice(
      (pagination.current - 1) * pagination.pageSize,
      pagination.current * pagination.pageSize
    );

  return (
    <div className="donation-audit-dashboard">
      <div className="dashboard-header">
        <h1>Donation Audit Logs</h1>
        <p>
          View all changes made to donations by users with editing permissions
        </p>
      </div>

      <div className="filter-section">
        <div className="filter-controls">
          <div className="input-group">
            <FiSearch className="input-icon" />
            <input
              placeholder="Filter by username"
              value={filters.username}
              onChange={(e) => handleFilter('username', e.target.value)}
              className="filter-input"
            />
            {filters.username && (
              <button 
                className="clear-button"
                onClick={() => handleFilter('username', '')}
              >
                ×
              </button>
            )}
          </div>
          
          <div className="input-group">
            <input
              placeholder="Donation ID"
              value={filters.donationId}
              onChange={(e) => handleFilter('donationId', e.target.value)}
              className="filter-input"
              type="number"
            />
            {filters.donationId && (
              <button 
                className="clear-button"
                onClick={() => handleFilter('donationId', '')}
              >
                ×
              </button>
            )}
          </div>
          
          <DatePicker
            selected={filters.date ? new Date(filters.date) : null}
            onChange={(date) => handleFilter('date', date ? date.toISOString() : null)}
            placeholderText="Filter by date"
            className="date-picker"
            isClearable
          />
          
          <button className="filter-button" onClick={resetFilters}>
            Reset Filters
          </button>
          
          <button 
            className="filter-button primary" 
            onClick={fetchAuditLogs}
          >
            <FiRefreshCw className="button-icon" /> Refresh
          </button>
        </div>
      </div>

      <div className="custom-table-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <table className="custom-table">
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column.id}>{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPageLogs.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="no-data">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  currentPageLogs.map(log => (
                    <tr key={log.id}>
                      {columns.map(column => (
                        <td key={`${log.id}-${column.id}`}>
                          {column.accessor(log)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="pagination">
              <button 
                className="pagination-button"
                disabled={pagination.current === 1}
                onClick={() => handleTableChange({ ...pagination, current: pagination.current - 1 })}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.current} of {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
              </span>
              
              <button 
                className="pagination-button"
                disabled={pagination.current * pagination.pageSize >= pagination.total}
                onClick={() => handleTableChange({ ...pagination, current: pagination.current + 1 })}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={detailsVisible}
        onRequestClose={() => setDetailsVisible(false)}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
        ariaHideApp={false} // To prevent accessibility warning
      >
        <div className="modal-header">
          <div className="modal-title">
            <FiFileText /> Audit Log Details
          </div>
          <button 
            className="modal-close"
            onClick={() => setDetailsVisible(false)}
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          {selectedLog ? (
            <div className="log-details">
              <div className="detail-row">
                <span className="label">User:</span>
                <span className="value">{selectedLog.username}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date & Time:</span>
                <span className="value">
                  {safeFormatDate(selectedLog.attributes?.timestamp || selectedLog.timestamp)}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Donation ID:</span>
                <span className="value">{selectedLog.donationId}</span>
              </div>
              <div className="detail-row">
                <span className="label">Action:</span>
                <span className="value">{getActionLabel(selectedLog.action)}</span>
              </div>
              {selectedLog.notes && (
                <div className="detail-row">
                  <span className="label">Notes:</span>
                  <span className="value">{selectedLog.notes}</span>
                </div>
              )}
              <div className="changes-section">
                <h3>Changes</h3>
                {selectedLog.changes ? 
                  renderChanges(JSON.parse(selectedLog.changes)) : 
                  <p>No detailed change information available</p>
                }
              </div>
            </div>
          ) : (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="modal-button"
            onClick={() => setDetailsVisible(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DonationAuditDashboard;
