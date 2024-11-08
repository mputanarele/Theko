import React from 'react';

const Navigation = ({ setView, currentUser, setCurrentUser }) => {
  return (
    <div className="navigation">
      <button onClick={() => setView('dashboard')}>Dashboard</button>
      <button onClick={() => setView('product-management')}>ProductManagement</button>
      <button onClick={() => setView('user-management')}>UserManagement</button>
      <button onClick={() => {
        setCurrentUser(null);
        setView('login');
      }}>Logout</button>
    </div>
  );
};

export default Navigation;
