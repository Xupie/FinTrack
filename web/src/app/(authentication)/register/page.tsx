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
    <main>
      <div className="">
        <label htmlFor="username">Username</label>
        <InputWithIcon
          name="username"
          placeholder="username"
          icon="/email/email.svg"
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <InputWithIcon
          name="password"
          placeholder="password"
          icon="/password/password.svg"
          required
        />
      </div>

      <Button
        onClick={sendRegister}
        disabled={loading}
        size="lg"
        text="Register"
        type="primary"
      />
      {error ? (
        <div className="bg-error-bg text-error-text py-2 px-2 rounded">
          <p>Wrong username or password!</p>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
