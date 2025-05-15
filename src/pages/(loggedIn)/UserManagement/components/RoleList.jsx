import React from 'react';

const RoleList = ({ roles, onEdit, onDelete }) => {
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

  // Get the number of users assigned to this role
  const getUserCount = (role) => {
    return role.nb_users || 0;
  };

  return (
    <div className="role-list">
      {roles.length === 0 ? (
        <div className="no-data">No roles found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Users</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.description || 'No description'}</td>
                <td>{role.type}</td>
                <td>{getUserCount(role)}</td>
                <td>{formatDate(role.createdAt)}</td>
                <td className="actions">
                  <button 
                    className="edit"
                    onClick={() => onEdit(role)}
                    title="Edit Role"
                    disabled={role.type === 'public' || role.type === 'authenticated'}
                  >
                    <i className="material-icons">edit</i>
                  </button>
                  <button 
                    className="delete"
                    onClick={() => onDelete(role.id)}
                    title="Delete Role"
                    disabled={role.type === 'public' || role.type === 'authenticated' || role.type === 'super-admin' || getUserCount(role) > 0}
                  >
                    <i className="material-icons">delete</i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="role-list-notes">
        <p><strong>Note:</strong> Default roles (public, authenticated, super-admin) cannot be deleted.</p>
        <p>Roles with assigned users cannot be deleted. You must reassign users first.</p>
      </div>
    </div>
  );
};

export default RoleList;
