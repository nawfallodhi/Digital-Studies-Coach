import { useState } from "react";

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
    <div style={{ padding: "20px" }}>
      <h1>Create Account</h1>
      <form onSubmit={handleRegister}>
        <label>Email:</label><br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />

        <br /><br />

        <label>Password:</label><br />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />

        <br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
