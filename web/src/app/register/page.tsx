"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../components/buttons/button";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function sendRegister() {
        setLoading(true);

        const username = (document.querySelector("input[name=username]") as HTMLInputElement).value;
        const password = (document.querySelector("input[name=password]") as HTMLInputElement).value;

        if (!username || !password) {
            setError(true);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: username, password: password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/dashboard");
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
            <label htmlFor="username">Username</label>
            <input type="text" name="username" />

            <label htmlFor="password">Password</label>
            <input type="password" name="password" />

            <Button onClick={sendRegister} disabled={loading} size="lg" text="Register" type="primary" />
            {error
                ?
                <div className="bg-error-bg text-error-text py-2 px-2 rounded">
                    <p>Virhe sähköpostissa tai salasanassa!</p>
                </div>
                : ""
            }
        </main>
    )
}