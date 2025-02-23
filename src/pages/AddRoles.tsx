import React, { useState } from 'react';

const AddRoles: React.FC = () => {
  const [roleName, setRoleName] = useState('');
  const [message, setMessage] = useState('');

  const handleAddRole = async () => {
    if (!roleName.trim()) {
      setMessage('Role name cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost/hq2sspapi/admin/add_roles.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_name: roleName }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Role added successfully.');
        setRoleName('');
      } else {
        setMessage(result.error || 'Failed to add role.');
      }
    } catch (error) {
      console.error('Error adding role:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Add New Role</h1>
      <input
        type="text"
        placeholder="Enter role name"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
      />
      <button onClick={handleAddRole}>Add Role</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddRoles;
