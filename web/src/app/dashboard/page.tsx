"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        async function getDashboardData() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard.php`, {
                method: "GET",
                credentials: 'include',
            });
            
            if (response.status === 401) {
                router.push("/login");
            }

            if (!response.ok) {
                console.error("Failed to fetch dashboard data");
            }

            const data = await response.json();
        };

        getDashboardData();
    }, []);

    return (
        <main>
            <h1>Dashboard</h1>
        </main>
    )
}