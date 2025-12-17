"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function logoutUser() {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout.php`, {
        credentials: "include",
      });
      router.push("/login");
    }

    logoutUser();
  }, [router]);

  return <p>logging out...</p>;
}
