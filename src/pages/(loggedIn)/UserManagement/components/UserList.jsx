import React, { useState } from 'react';
import Button from './ui/Button';
import ViewToggle from './ui/ViewToggle';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import CommunicationBadge from './ui/CommunicationBadge';
import '../components/ui/shadcn.scss';

const UserList = ({ users, roles, onEdit, onDelete, currentUserId }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users by search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.name?.toLowerCase().includes(searchLower) ||
      (user.stopCommunication && 'no communication'.includes(searchLower)) ||
      (user.stopCommunication && user.communicationStopReason?.toLowerCase().includes(searchLower))
    );
  });

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get role name by id
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  };
  
  // Get user initials for avatar
  const getUserInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };
  
  // Render grid view
  const renderGridView = () => {
    if (filteredUsers.length === 0) {
      return <div className="no-data">No users matching '{searchTerm}'</div>;
    }
    
    return (
      <div className="user-grid">
        {filteredUsers.map(user => (
          <Card key={user.id} className="user-grid-item">
            <CardContent>
              <div className="user-avatar">
                {getUserInitials(user.username)}
              </div>
              <div className="user-name">{user.username}</div>
              <div className="user-email">{user.email}</div>
              <div className="user-role">
                {user.role?.name || getRoleName(user.role?.id) || 'N/A'}
              </div>
              <div className="user-status-wrapper">
                <div className={`user-status ${user.blocked ? 'blocked' : 'active'}`}>
                  {user.blocked ? 'Blocked' : 'Active'}
                </div>
                <CommunicationBadge status={user.stopCommunication} reason={user.communicationStopReason} />
              </div>
            </CardContent>
            <div className="shadcn-card-footer">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(user)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(user.id)}
                disabled={user.id === currentUserId}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render list view
  const renderListView = () => {
    if (filteredUsers.length === 0) {
      return <div className="no-data">No users matching '{searchTerm}'</div>;
    }
    
    return (
      <table className="user-list-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Communication</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>
                <div className="user-avatar-small">
                  {getUserInitials(user.username)}
                </div>
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className="user-role-badge">
                  {user.role?.name || getRoleName(user.role?.id) || 'N/A'}
                </span>
              </td>
              <td>
                <span className={`user-status-indicator ${user.blocked ? 'blocked' : 'active'}`}>
                  {user.blocked ? 'Blocked' : 'Active'}
                </span>
              </td>
              <td>
                <CommunicationBadge status={user.stopCommunication} reason={user.communicationStopReason} />
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <div className="action-buttons">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(user.id)}
                    disabled={user.id === currentUserId}
                    className="text-destructive"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="user-list">
      <div className="user-list-header">
        <div className="search-filter">
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
        <ViewToggle view={viewMode} onViewChange={setViewMode} />
      </div>
      
      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </div>
  );
};

export default UserList;
