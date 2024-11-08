import React, { useState } from 'react';

const UserManagement = ({ registeredUsers, setRegisteredUsers, setView }) => {
  const [form, setForm] = useState({ id: '', username: '', password: '' });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.id) {
      const updatedUsers = registeredUsers.map((user) =>
        user.id === form.id ? { id: user.id, username: form.username, password: form.password } : user
      );
      setRegisteredUsers(updatedUsers);
    } else {
      const newUser = {
        id: registeredUsers.length ? registeredUsers[registeredUsers.length - 1].id + 1 : 1,
        username: form.username,
        password: form.password,
      };
      setRegisteredUsers([...registeredUsers, newUser]);
    }
    setForm({ id: '', username: '', password: '' });
  };

  const handleEdit = (user) => {
    setForm({ id: user.id, username: user.username, password: user.password });
  };

  const handleDelete = (id) => {
    setRegisteredUsers(registeredUsers.filter(user => user.id !== id));
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add/Update User</button>
      </form>

      <h3>User List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registeredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setView('dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default UserManagement;
