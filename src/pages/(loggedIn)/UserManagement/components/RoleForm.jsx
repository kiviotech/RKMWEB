import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import '../UserManagement.scss';

const RoleForm = ({ role, permissions, onSubmit, onCancel }) => {
  const isNewRole = !!role.isNew;
  const [formData, setFormData] = useState({
    name: role.name || '',
    description: role.description || '',
    type: role.type || '',
    permissions: {}
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [permissionGroups, setPermissionGroups] = useState({});

  // Process and group permissions by controller when component mounts
  useEffect(() => {
    if (permissions && permissions.permissions) {
      // Group permissions by API/controller
      const groups = {};
      
      Object.entries(permissions.permissions).forEach(([pluginName, pluginPerms]) => {
        Object.entries(pluginPerms.controllers).forEach(([controller, actions]) => {
          const groupName = `${pluginName}.${controller}`;
          
          if (!groups[groupName]) {
            groups[groupName] = {
              name: formatGroupName(groupName),
              permissions: []
            };
          }
          
          // Add each permission to the group
          Object.entries(actions).forEach(([actionName, actionData]) => {
            groups[groupName].permissions.push({
              id: actionData.id,
              action: actionName,
              displayName: formatActionName(actionName),
              description: actionData.description,
              enabled: role.permissions?.includes(actionData.id) || false
            });
          });
        });
      });
      
      setPermissionGroups(groups);
      
      // Initialize selected permissions based on role
      if (role.permissions) {
        const initialPermissions = {};
        role.permissions.forEach(permId => {
          initialPermissions[permId] = true;
        });
        
        setFormData(prev => ({
          ...prev,
          permissions: initialPermissions
        }));
      }
    }
  }, [permissions, role.permissions]);

  const formatGroupName = (name) => {
    // Format group name for display (e.g., "api::donation.donation" -> "API Donation")
    if (name.startsWith('api::')) {
      const parts = name.split('::')[1].split('.');
      return `API ${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)}`;
    }
    return name.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  const formatActionName = (action) => {
    // Format action name for display (e.g., "findOne" -> "Find One")
    return action.replace(/([A-Z])/g, ' $1').trim()
      .replace(/^./, str => str.toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTypeChange = (e) => {
    // Auto-generate the type from the name if the field is empty
    let value = e.target.value;
    if (!value && formData.name) {
      value = formData.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    setFormData({
      ...formData,
      type: value
    });
  };

  const handlePermissionChange = (permissionId) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permissionId]: !formData.permissions[permissionId]
      }
    });
  };

  const handleSelectAllInGroup = (groupPermissions, select) => {
    const newPermissions = { ...formData.permissions };
    
    groupPermissions.forEach(permission => {
      newPermissions[permission.id] = select;
    });
    
    setFormData({
      ...formData,
      permissions: newPermissions
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'Role type is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.type)) {
      newErrors.type = 'Role type can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });
    
    try {
      // Format permissions for submission
      // Convert { id1: true, id2: false } to [id1]
      const selectedPermissions = Object.entries(formData.permissions)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      // Prepare data for submission
      const roleData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        permissions: selectedPermissions
      };
      
      const result = await onSubmit(roleData);
      
      if (result.success) {
        setFeedback({ 
          type: 'success', 
          message: `Role ${isNewRole ? 'created' : 'updated'} successfully!`
        });
        
        // Reset form if successful and new role
        if (isNewRole) {
          setFormData({
            name: '',
            description: '',
            type: '',
            permissions: {}
          });
        }
      } else {
        setFeedback({ 
          type: 'error', 
          message: result.error || `Failed to ${isNewRole ? 'create' : 'update'} role.`
        });
      }
    } catch (error) {
      console.error('Error submitting role form:', error);
      setFeedback({ 
        type: 'error', 
        message: error.message || `An error occurred while ${isNewRole ? 'creating' : 'updating'} the role.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate if a group has all permissions selected
  const isGroupFullySelected = (groupPermissions) => {
    return groupPermissions.every(permission => 
      formData.permissions[permission.id]
    );
  };
  
  // Calculate if a group has some but not all permissions selected
  const isGroupPartiallySelected = (groupPermissions) => {
    const selected = groupPermissions.some(permission => 
      formData.permissions[permission.id]
    );
    
    return selected && !isGroupFullySelected(groupPermissions);
  };

  return (
    <Card className="role-form-card">
      <CardHeader>
        <CardTitle>{isNewRole ? 'Create New Role' : 'Edit Role'}</CardTitle>
      </CardHeader>
      <CardContent>
        {feedback.message && (
          <div className={`feedback-alert ${feedback.type}`}>
            <div className="alert-icon">
              {feedback.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>
            <span>{feedback.message}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Role Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter role name"
                disabled={isSubmitting}
              />
              {errors.name && <div className="input-error-message">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="type" className="form-label">Role Type</label>
              <input
                type="text"
                id="type"
                name="type"
                className={`form-input ${errors.type ? 'input-error' : ''}`}
                value={formData.type}
                onChange={handleTypeChange}
                placeholder="Enter role type (e.g., content-editor)"
                disabled={isSubmitting || !isNewRole}
              />
              {!isNewRole && (
                <div className="field-note">
                  Role type cannot be changed after creation.
                </div>
              )}
              {errors.type && <div className="input-error-message">{errors.type}</div>}
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter role description"
                rows={3}
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>

          <div className="permissions-section">
            <h3 className="permissions-header">Permissions</h3>
            
            {Object.keys(permissionGroups).length === 0 ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Loading permissions...</span>
              </div>
            ) : (
              <div className="permissions-container">
                {/* Group permissions into rows with 3 cards each for more efficient layout */}
                {Object.entries(permissionGroups).reduce((rows, [groupId, group], index, array) => {
                  // Create rows with 3 permission groups each (or fewer for the last row)
                  if (index % 3 === 0) {
                    // Start a new row
                    rows.push([
                      <Card key={groupId} className="permission-group-card">
                        <CardHeader className="permission-group-header">
                          <CardTitle className="permission-group-title">{group.name}</CardTitle>
                          <div className="group-actions">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectAllInGroup(group.permissions, true)}
                              disabled={isSubmitting || isGroupFullySelected(group.permissions)}
                            >
                              Select All
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectAllInGroup(group.permissions, false)}
                              disabled={isSubmitting || (!isGroupFullySelected(group.permissions) && !isGroupPartiallySelected(group.permissions))}
                            >
                              Deselect All
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="permissions-grid">
                            {group.permissions.map(permission => (
                              <div key={permission.id} className="permission-item">
                                <label className="permission-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={!!formData.permissions[permission.id]}
                                    onChange={() => handlePermissionChange(permission.id)}
                                    disabled={isSubmitting}
                                  />
                                  <div className="permission-content">
                                    <span className="permission-name">{permission.displayName}</span>
                                    {permission.description && (
                                      <span className="permission-description">{permission.description}</span>
                                    )}
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ]);
                  } else {
                    // Add to the last row
                    rows[rows.length - 1].push(
                      <Card key={groupId} className="permission-group-card">
                        <CardHeader className="permission-group-header">
                          <CardTitle className="permission-group-title">{group.name}</CardTitle>
                          <div className="group-actions">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectAllInGroup(group.permissions, true)}
                              disabled={isSubmitting || isGroupFullySelected(group.permissions)}
                            >
                              Select All
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectAllInGroup(group.permissions, false)}
                              disabled={isSubmitting || (!isGroupFullySelected(group.permissions) && !isGroupPartiallySelected(group.permissions))}
                            >
                              Deselect All
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="permissions-grid">
                            {group.permissions.map(permission => (
                              <div key={permission.id} className="permission-item">
                                <label className="permission-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={!!formData.permissions[permission.id]}
                                    onChange={() => handlePermissionChange(permission.id)}
                                    disabled={isSubmitting}
                                  />
                                  <div className="permission-content">
                                    <span className="permission-name">{permission.displayName}</span>
                                    {permission.description && (
                                      <span className="permission-description">{permission.description}</span>
                                    )}
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                  return rows;
                }, []).map((row, i) => (
                  <div key={`row-${i}`} className="permission-row">
                    {row}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  <span>Saving...</span>
                </>
              ) : isNewRole ? 'Create Role' : 'Update Role'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoleForm;
