"use client"

import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout.php`, {
        credentials: "include",
    })
    router.push("/login")
}