import React, { useState } from 'react';
import Button from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import '../components/ui/shadcn.scss';

const InvitationList = ({ invitations, onEdit, onResend, onDelete, onNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter invitations by search term
  const filteredInvitations = invitations.filter(invite => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (invite.name || invite.username || '').toLowerCase().includes(searchLower) ||
      (invite.email || '').toLowerCase().includes(searchLower) ||
      (invite.status || '').toLowerCase().includes(searchLower)
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

  // Get initials for avatar
  const getInitials = (name, email) => {
    if (name && typeof name === 'string' && name.length > 0) return name.charAt(0).toUpperCase();
    if (email && typeof email === 'string' && email.length > 0) return email.charAt(0).toUpperCase();
    return '?';
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
              placeholder="Search invitations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <Button onClick={onNew} className="ml-auto" variant="primary">
          + New Invitation
        </Button>
      </div>
      <table className="user-list-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvitations.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-400">
                No invitations found.
              </td>
            </tr>
          ) : (
            filteredInvitations.map(invite => (
              <tr key={invite.id}>
                <td>
                  <div className="user-avatar-small bg-primary-light text-primary font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                    {getInitials(invite.name || invite.username, invite.email)}
                  </div>
                </td>
                <td>{invite.name || invite.username || 'N/A'}</td>
                <td>{invite.email || 'N/A'}</td>
                <td>
                  <span className={`user-role-badge ${invite.status ? invite.status.toLowerCase() : ''}`}>{invite.status || 'N/A'}</span>
                </td>
                <td>{formatDate(invite.createdAt)}</td>
                <td>
                  <div className="action-buttons flex gap-2">
                    <Button variant="ghost" size="sm" title="Edit" onClick={() => onEdit(invite)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Button>
                    <Button variant="ghost" size="sm" title="Resend" onClick={() => onResend(invite)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M1 19a9 9 0 0 0 14-7V4"></path></svg>
                    </Button>
                    <Button variant="ghost" size="sm" title="Delete" onClick={() => onDelete(invite)} className="text-destructive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvitationList;
