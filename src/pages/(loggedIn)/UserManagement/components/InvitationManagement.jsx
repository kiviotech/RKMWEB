import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import './InvitationManagement.custom.scss';
import { fetchEligibleUsers, exportUsersForInvitation, sendInvitations, getUsersGroupedByAddress } from '../../../../../services/invitationManagement';
import { saveAs } from 'file-saver';
import { ShadcnInvitationTable } from '../../../../components/ui/ShadcnInvitationTable';

const InvitationManagement = () => {
  const [criteria, setCriteria] = useState({
    hasDeeksha: false,
    minDonationAmount: 0,
    hasCapitalInvestment: false,
    startDate: '',
    endDate: ''
  });

  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [groupByAddress, setGroupByAddress] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('email');
  const [searchTerm, setSearchTerm] = useState('');
  const [templateMessage, setTemplateMessage] = useState('');
  const [actionFeedback, setActionFeedback] = useState({ type: '', message: '' });

  // Filter users by search term
  const filteredUsers = eligibleUsers.filter(user => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm) ||
      user.address?.toLowerCase().includes(searchLower)
    );
  });

  const handleCriteriaChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCriteria({
      ...criteria,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setActionFeedback({ type: '', message: '' });
    
    try {
      // The service will add default values for empty filters to ensure we fetch all users
      const users = await fetchEligibleUsers(criteria);
      setEligibleUsers(users);
      setSelectedUsers([]);
      
      // Show feedback about how many users were found
      if (users.length === 0) {
        setActionFeedback({ 
          type: 'info', 
          message: 'No users found matching your criteria.' 
        });
      } else {
        setActionFeedback({ 
          type: 'success', 
          message: `Found ${users.length} user${users.length !== 1 ? 's' : ''} matching your criteria.` 
        });
      }
    } catch (error) {
      console.error('Error fetching eligible users:', error);
      setActionFeedback({ 
        type: 'error', 
        message: error.message || 'Failed to fetch eligible users. Please try again.' 
      });
      setEligibleUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleExport = async () => {
    if (selectedUsers.length === 0) {
      setActionFeedback({ 
        type: 'error', 
        message: 'Please select at least one user to export' 
      });
      return;
    }

    setIsLoading(true);
    setActionFeedback({ type: '', message: '' });
    
    try {
      const blob = await exportUsersForInvitation(selectedUsers, exportFormat, groupByAddress);
      const fileName = `invitation_list_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      saveAs(blob, fileName);
      
      setActionFeedback({ 
        type: 'success', 
        message: 'Data exported successfully' 
      });
    } catch (error) {
      setActionFeedback({ 
        type: 'error', 
        message: error.message || 'Failed to export data' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvitations = async () => {
    if (selectedUsers.length === 0) {
      setActionFeedback({ 
        type: 'error', 
        message: 'Please select at least one user to send invitations' 
      });
      return;
    }

    if (!templateMessage.trim()) {
      setActionFeedback({ 
        type: 'error', 
        message: 'Please enter a message template' 
      });
      return;
    }

    setIsLoading(true);
    setActionFeedback({ type: '', message: '' });
    
    try {
      const result = await sendInvitations(selectedUsers, selectedChannel, { 
        message: templateMessage 
      });
      
      setActionFeedback({ 
        type: 'success', 
        message: `Invitations sent successfully to ${result.sentCount} users` 
      });
    } catch (error) {
      setActionFeedback({ 
        type: 'error', 
        message: error.message || 'Failed to send invitations' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="invitation-management">
      <Card>
        <CardHeader>
          <CardTitle>Invitation Management</CardTitle>
          <p className="card-description">Send invitations to special users and export data for manual invitations</p>
        </CardHeader>
        <CardContent>
          <div className="criteria-section">
            <h3>Selection Criteria</h3>
            <div className="criteria-grid">
              <div className="criteria-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasDeeksha"
                    checked={criteria.hasDeeksha}
                    onChange={handleCriteriaChange}
                  />
                  Has Taken Deeksha
                </label>
              </div>
              
              <div className="criteria-item">
                <label>
                  Minimum Donation Amount
                  <input
                    type="number"
                    name="minDonationAmount"
                    value={criteria.minDonationAmount}
                    onChange={handleCriteriaChange}
                    placeholder="Enter minimum amount"
                    min="0"
                  />
                </label>
              </div>
              
              <div className="criteria-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasCapitalInvestment"
                    checked={criteria.hasCapitalInvestment}
                    onChange={handleCriteriaChange}
                  />
                  Has Capital Investment
                </label>
              </div>
              
              <div className="criteria-item">
                <label>
                  Start Date
                  <input
                    type="date"
                    name="startDate"
                    value={criteria.startDate}
                    onChange={handleCriteriaChange}
                  />
                </label>
              </div>
              
              <div className="criteria-item">
                <label>
                  End Date
                  <input
                    type="date"
                    name="endDate"
                    value={criteria.endDate}
                    onChange={handleCriteriaChange}
                  />
                </label>
              </div>
            </div>
            
            <div className="criteria-actions">
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search Users'}
              </Button>
            </div>
          </div>
          
          {eligibleUsers.length > 0 && (
            <>
              <div className="users-section">
                <div className="users-header">
                  <h3>Eligible Users ({filteredUsers.length})</h3>
                  <div className="search-input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
                
                <div className="users-list">
  <div className="table-container invitation-table">
    <table>
      <thead>
        <tr>
          <th style={{width: 40}}>
            <input
              type="checkbox"
              className="select-checkbox"
              checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
              indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
              onChange={e => {
                if (e.target.checked) {
                  setSelectedUsers(filteredUsers.map(u => u.id));
                } else {
                  setSelectedUsers([]);
                }
              }}
              aria-label="Select all"
            />
          </th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-gray-400">
              No invitations found.
            </td>
          </tr>
        ) : (
          filteredUsers.map((user, idx) => {
            const isSelected = selectedUsers.includes(user.id);
            return (
              <tr key={user.id || user.email || idx} className={(idx % 2 === 0 ? 'bg-white' : 'bg-gray-50') + (isSelected ? ' selected-row' : '')}>
                {/* Select checkbox */}
                <td className="align-middle">
                  <input
                    type="checkbox"
                    className="select-checkbox"
                    checked={isSelected}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                    aria-label={`Select ${user.username || user.email}`}
                  />
                </td>
                {/* Username + Avatar */}
                <td className="align-middle flex items-center gap-2 py-2">
                  <div className="avatar-circle bg-primary/10 text-primary font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {(user.username || user.name || user.email || '?')[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{user.username || user.name || 'N/A'}</span>
                </td>
                {/* Email */}
                <td className="align-middle text-gray-700">{user.email || 'N/A'}</td>
                {/* Role */}
                <td className="align-middle">
                  <span className="role-badge bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold">N/A</span>
                </td>
                {/* Status */}
                <td className="align-middle">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-green-700 font-medium">Active</span>
                  </span>
                </td>
                {/* Created */}
                <td className="align-middle text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </td>
                {/* Actions */}
                <td className="align-middle">
                  <div className="action-buttons flex gap-2">
                    <button className="icon-btn" title="Edit" onClick={() => alert('Edit invitation')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="icon-btn" title="Resend" onClick={() => alert('Resend invitation')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M1 19a9 9 0 0 0 14-7V4"></path></svg>
                    </button>
                    <button className="icon-btn text-destructive" title="Delete" onClick={() => alert('Delete invitation')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>
              </div>
              
              <div className="action-section">
                <div className="export-section">
                  <h3>Export Options</h3>
                  <div className="export-options">
                    <div className="option-item">
                      <label>Format</label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                      >
                        <option value="xlsx">Excel (.xlsx)</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>
                    
                    <div className="option-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={groupByAddress}
                          onChange={(e) => setGroupByAddress(e.target.checked)}
                        />
                        Group users by address
                      </label>
                    </div>
                    
                    <div style={{display: 'flex', gap: '10px'}}>
  <Button
    onClick={handleExport}
    disabled={isLoading || selectedUsers.length === 0}
    variant="outline"
  >
    {isLoading ? 'Exporting...' : 'Export Selected'}
  </Button>
  <Button
    onClick={async () => {
      if (filteredUsers.length === 0) return;
      setIsLoading(true);
      setActionFeedback({ type: '', message: '' });
      try {
        const allIds = filteredUsers.map(u => u.id);
        const blob = await exportUsersForInvitation(allIds, exportFormat, groupByAddress);
        const fileName = `invitation_list_all_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        saveAs(blob, fileName);
        setActionFeedback({ type: 'success', message: 'All filtered users exported successfully' });
      } catch (error) {
        setActionFeedback({ type: 'error', message: error.message || 'Failed to export all users' });
      } finally {
        setIsLoading(false);
      }
    }}
    disabled={isLoading || filteredUsers.length === 0}
    variant="default"
    style={{background: 'var(--primary)', color: 'white'}}
  >
    {isLoading ? 'Exporting...' : 'Export All'}
  </Button>
</div>
                  </div>
                </div>
                
                <div className="invitation-section">
                  <h3>Send Invitations</h3>
                  <div className="invitation-options">
                    <div className="option-item">
                      <label>Channel</label>
                      <select
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value)}
                      >
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>
                    
                    <div className="option-item full-width">
                      <label>Message Template</label>
                      <textarea
                        value={templateMessage}
                        onChange={(e) => setTemplateMessage(e.target.value)}
                        placeholder="Enter invitation message..."
                        rows={4}
                      />
                      <p className="hint-text">Use {'{'} name {'}'}, {'{'} date {'}'}, and {'{'} venue {'}'} as placeholders</p>
                    </div>
                    
                    <Button 
                      onClick={handleSendInvitations}
                      disabled={isLoading || selectedUsers.length === 0 || !templateMessage.trim()}
                    >
                      {isLoading ? 'Sending...' : `Send via ${selectedChannel}`}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {actionFeedback.message && (
            <div className={`feedback-message ${actionFeedback.type}`}>
              {actionFeedback.message}
            </div>
          )}
          
          {eligibleUsers.length === 0 && !isLoading && (
            <div className="no-users-found">
              <p>No eligible users found. Try adjusting your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationManagement;
