import { cookies } from "next/headers";
import DashboardClient from "./dashboardClient";

export default async function Dashboard() {
    const url = process.env.NEXT_PUBLIC_API_URL;

    const headers = new Headers();
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("PHPSESSID")?.value;
    sessionCookie ? headers.append("cookie", `PHPSESSID=${sessionCookie}`) : ""

    // Fetch categories
    const categoriesRes = await fetch(`${url}/main.php?action=show_categories`, {
        method: "GET",
        headers: headers,
        cache: "no-store",
    });

    let categories = [];
    if (categoriesRes.ok) {
        categories = await categoriesRes.json();
    }

    // Fetch current month summary on the server
    const now = new Date();
    const monthStr = String(now.getMonth() + 1).padStart(2, "0");

    const budgetRes = await fetch(
        `${url}/main.php?action=summary`,
        {
            method: "POST",
            headers: headers,
            cache: "no-store",
            body: JSON.stringify({
                year: now.getFullYear(),
                month: monthStr,
                include_transactions: true,
            }),
        }
    );

    let budget = null;
    if (budgetRes.ok) {
        budget = await budgetRes.json();
    }

    return (
        <DashboardClient 
            initialBudget={budget} 
            initialCategories={categories}
            initialDate={now}
        />
        
    )
}