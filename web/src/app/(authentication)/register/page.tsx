"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../../components/buttons/button";
import InputWithIcon from "../../components/input";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function sendRegister() {
    setLoading(true);

    const username = (
      document.querySelector("input[name=username]") as HTMLInputElement
    ).value;
    const password = (
      document.querySelector("input[name=password]") as HTMLInputElement
    ).value;

    if (!username || !password) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password: password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
        return;
      }

      setError(true);
      console.error(data.error);
    } catch (err) {
      setError(true);
      console.error(err);
    }

    setLoading(false);
  }

  return (
  <main className="main-container">
    <section className="login-card">
      <h1>REGISTER PAGE</h1>

      <div className="input-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          required
        />
      </div>

      <div className="input-group password">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <button onClick={sendRegister} disabled={loading} className="login-button">
        Register
      </button>

      {error && (
        <div className="error-msg">
          Wrong username or password!
        </div>
      )}

      <p className="login-footer">
        Already have an account? <a href="/login">Log In</a>
      </p>
    </section>
  </main>

  );
}
