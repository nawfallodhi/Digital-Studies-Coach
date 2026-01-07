import { useState } from "react";
import {Link} from "react-router";
import "../styles/register.css"

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return setError(data.detail || "Error creating account");

    alert("Account created! You can now log in.");
    window.location.href = "/login";
  }

return (
    <div className="register-container">
      <h1>Create Account</h1>
      
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="register-button">
          Register
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', color: '#6b7280', fontSize: '0.95rem' }}>
        Already have an account?{' '}
        <Link 
          to="/login" 
          style={{ 
            color: '#6366f1', 
            fontWeight: '600', 
            textDecoration: 'none' 
          }}
        >
          Login here
        </Link>
      </p>
    </div>
  );
};