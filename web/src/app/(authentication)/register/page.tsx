"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../../components/buttons/button";
import ErrorBox from "@/app/components/error";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorBoxVisible, setErrorBoxVisible] = useState(false);

  async function sendregister() {
    setLoading(true);
    setErrorBoxVisible(false);

    const username = (
      document.querySelector("input[name=username]") as HTMLInputElement
    ).value;
    const password = (
      document.querySelector("input[name=password]") as HTMLInputElement
    ).value;

    if (!username || !password) {
      setErrorBoxVisible(true);
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

      if (response.ok) {
        router.push("/login");
        return;
      }

      setErrorBoxVisible(true);
    } catch (err) {
      setErrorBoxVisible(true);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex justify-center items-center align-middle">
      <section className="bg-primary w-full p-8 rounded-2xl max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">REGISTER</h1>

        <div className="mb-4 block">
          <label className="mb-1 block" htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            className="w-full bg-background py-3 px-4 rounded-xl transition"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="block mb-6">
          <label className="mb-1 block" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="w-full bg-background py-3 px-4 rounded-xl transition"
            placeholder="Enter your password"
            required
          />
        </div>

        <Button fullWidth type="login" size="xl" text="Register" onClick={sendregister} disabled={loading} />

        {errorBoxVisible && (
          <ErrorBox text="Wrong username or password!" onClose={() => setErrorBoxVisible(false)} />
        )}

        <p className="text-md text-center mt-6 font-medium">Already have an account? <Link className="text-green-300 underline" href={"/login"}>Log in</Link></p>

      </section>
    </main>
  );
}