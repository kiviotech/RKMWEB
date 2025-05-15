import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FiSearch, FiRefreshCw, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '../../../../store/authStore';
import notificationService from '../../../../services/notificationService';
import './Notifications.scss';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    date: null,
    showUnreadOnly: false,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Check if user is super-admin
  useEffect(() => {
    const userRole = user?.role?.type || user?.user_role;
    if (userRole !== 'super-admin') {
      // Redirect unauthorized users
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Apply client-side filters to the full dataset
  const applyFilters = useCallback(() => {
    let result = [...notifications];
    
    // Filter by title if specified
    if (filters.title) {
      result = result.filter(notification => {
        const title = notification.attributes?.title || '';
        const message = notification.attributes?.message || '';
        const searchTerm = filters.title.toLowerCase();
        return title.toLowerCase().includes(searchTerm) || 
               message.toLowerCase().includes(searchTerm);
      });
    }
    
    // Filter by date if specified
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filterDate.setHours(0, 0, 0, 0);
      const filterDateEnd = new Date(filters.date);
      filterDateEnd.setHours(23, 59, 59, 999);
      
      result = result.filter(notification => {
        try {
          const notificationDate = new Date(notification.attributes?.createdAt);
          return notificationDate >= filterDate && notificationDate <= filterDateEnd;
        } catch (error) {
          return false;
        }
      });
    }
    
    // Filter by read status if showUnreadOnly is true
    if (filters.showUnreadOnly) {
      result = result.filter(notification => !notification.attributes?.isRead);
    }
    
    // Update filtered notifications
    setFilteredNotifications(result);
    
    // Update pagination total
    setPagination({
      ...pagination,
      total: result.length
    });
    
  }, [notifications, filters, pagination]);
  
  // Run filter whenever filters or notifications change
  useEffect(() => {
    applyFilters();
  }, [filters, notifications, applyFilters]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      
      if (response.success) {
        setNotifications(response.notifications || []);
        console.log('Notifications fetched successfully:', response.notifications?.length);
      } else {
        console.error('Failed to fetch notifications:', response.error);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      current: newPage,
    });
  };

  const handleFilter = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, current: 1 }); // Reset to first page on filter change
  };

  const resetFilters = () => {
    setFilters({
      title: '',
      date: null,
      showUnreadOnly: false,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
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

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      // Update local state to reflect the change
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? 
          { ...notification, attributes: { ...notification.attributes, isRead: true } } : 
          notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.attributes?.isRead) {
      markAsRead(notification.id);
    }
    
    // Navigate based on resourceType and resourceId if available
    const { resourceType, resourceId } = notification.attributes || {};
    if (resourceType === 'donation' && resourceId) {
      navigate(`/allDonation?donationId=${resourceId}`);
    }
  };

  // Calculate the current page slice of filtered notifications
  const currentPageNotifications = filteredNotifications
    .slice(
      (pagination.current - 1) * pagination.pageSize,
      pagination.current * pagination.pageSize
    );

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>All Notifications</h1>
        <p>View and manage all system notifications</p>
      </div>

      <div className="filter-section">
        <div className="filter-controls">
          <div className="input-group">
            <FiSearch className="input-icon" />
            <input
              placeholder="Search notifications"
              value={filters.title}
              onChange={(e) => handleFilter('title', e.target.value)}
              className="filter-input"
            />
            {filters.title && (
              <button 
                className="clear-button"
                onClick={() => handleFilter('title', '')}
              >
                ×
              </button>
            )}
          </div>
          
          <div className="filter-checkbox">
            <input
              type="checkbox"
              id="unread-only"
              checked={filters.showUnreadOnly}
              onChange={(e) => handleFilter('showUnreadOnly', e.target.checked)}
            />
            <label htmlFor="unread-only">Unread Only</label>
          </div>
          
          <button className="filter-button" onClick={resetFilters}>
            Reset Filters
          </button>
          
          <button 
            className="filter-button primary" 
            onClick={fetchNotifications}
          >
            <FiRefreshCw className="button-icon" /> Refresh
          </button>
        </div>
      </div>

      <div className="notifications-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : (
          <>
            {currentPageNotifications.length === 0 ? (
              <div className="no-notifications-message">
                <FiInfo size={48} />
                <p>No notifications found</p>
                {filters.title || filters.date || filters.showUnreadOnly ? (
                  <button className="filter-button" onClick={resetFilters}>
                    Clear Filters
                  </button>
                ) : null}
              </div>
            ) : (
              <ul className="notifications-list">
                {currentPageNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`notification-item ${!notification.attributes?.isRead ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-content">
                      <div className="notification-header">
                        <h3>{notification.attributes?.title}</h3>
                        {notification.attributes?.isRead ? (
                          <span className="read-status">
                            <FiCheckCircle /> Read
                          </span>
                        ) : (
                          <span className="unread-status">Unread</span>
                        )}
                      </div>
                      <p className="notification-message">{notification.attributes?.message}</p>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {safeFormatDate(notification.attributes?.createdAt)}
                        </span>
                        {notification.attributes?.resourceType && (
                          <span className="notification-resource">
                            {notification.attributes?.resourceType}: {notification.attributes?.resourceId}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {filteredNotifications.length > 0 && (
              <div className="pagination">
                <button 
                  className="pagination-button"
                  disabled={pagination.current === 1}
                  onClick={() => handlePageChange(pagination.current - 1)}
                >
                  Previous
                </button>
                
                <span className="pagination-info">
                  Page {pagination.current} of {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
                </span>
                
                <button 
                  className="pagination-button"
                  disabled={pagination.current * pagination.pageSize >= pagination.total}
                  onClick={() => handlePageChange(pagination.current + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
