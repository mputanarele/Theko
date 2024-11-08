import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import Navigation from './Navigation';
import './app.css';

const App = () => {
  const [view, setView] = useState('login');
  const [products, setProducts] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      axios.get('http://localhost:3000/api/products')
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching products:', error));

      axios.get('http://localhost:3000/api/users')
        .then(response => setRegisteredUsers(response.data))
        .catch(error => console.error('Error fetching users:', error));
    }
  }, [currentUser]);

  const addProduct = (product) => {
    if (!product.name || !product.price || !product.quantity) {
      setMessage('All product fields are required');
      return;
    }

    axios.post('http://localhost:3000/api/products', product)
      .then(response => {
        setProducts(prevProducts => [...prevProducts, response.data]);
        setMessage('Product added successfully');
      })
      .catch(error => {
        setMessage(error.response?.data?.error || 'Error adding product.');
      });
  };

  const handleUserLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      axios.post('http://localhost:3000/api/login', { username, password })
        .then(response => {
          setCurrentUser(response.data.user);
          setView('dashboard');
        })
        .catch(error => {
          setMessage(error.response?.data?.error || 'Login failed.');
        });
    } else {
      setMessage('Both fields are required');
    }
  };

  const handleUserRegister = (e) => {
    e.preventDefault();
    if (username && password) {
      axios.post('http://localhost:3000/api/register', { username, password })
        .then(response => {
          setMessage('Registration successful! Please login.');
          setView('login');
        })
        .catch(error => {
          setMessage(error.response?.data?.error || 'Registration failed.');
        });
    } else {
      setMessage('Both fields are required');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  return (
    <div className="app-container">
      {currentUser && (
        <Navigation
          setView={setView}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}

      {view === 'login' && (
        <div className="auth-form">
          <h2>Login</h2>
          <form onSubmit={handleUserLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          {message && <p>{message}</p>}
          <button onClick={() => setView('register')}>Don't have an account? Register</button>
        </div>
      )}

      {view === 'register' && (
        <div className="auth-form">
          <h2>Register</h2>
          <form onSubmit={handleUserRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </form>
          {message && <p>{message}</p>}
          <button onClick={() => setView('login')}>Already have an account? Login</button>
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard products={products} />
      )}

      {view === 'product-management' && (
        <ProductManagement
          addProduct={addProduct}
          products={products}
          setView={setView}
        />
      )}

      {view === 'user-management' && (
        <UserManagement
          setView={setView}
          registeredUsers={registeredUsers}
          setRegisteredUsers={setRegisteredUsers}
        />
      )}
    </div>
  );
};

export default App;
