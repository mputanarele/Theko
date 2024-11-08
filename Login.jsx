import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Sending login request to server
    axios
      .post("http://localhost:3000/api/login", { username, password })
      .then((response) => {
        onLogin(response.data.user); // If login is successful
      })
      .catch((error) => {
        setErrorMessage("Login failed. Try again.");
        console.error("Login error:", error);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Sending registration request to server
    axios
      .post("http://localhost:3000/api/users", { username, password })
      .then((response) => {
        onLogin(response.data.user); // If registration is successful
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "Registration failed. Try again.");
        console.error("Registration error:", error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

      <p>Don't have an account? 
        <button onClick={() => setErrorMessage('')}>
          Register
        </button>
      </p>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
