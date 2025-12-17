import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboardClient";

export default async function Dashboard() {
  const url = process.env.API_INTERNAL_URL;
  if (!url) {
    throw new Error("API_INTERNAL_URL is not defined");
  }

  const headers = new Headers();
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("PHPSESSID")?.value;
  if (sessionCookie) headers.append("cookie", `PHPSESSID=${sessionCookie}`);

  // Fetch categories directly from internal API
  const categoriesRes = await fetch(`${url}/main.php?action=show_categories`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (categoriesRes.status === 401) return redirect("/login");

  let categories = [];
  if (categoriesRes.ok) {
    categories = await categoriesRes.json();
  }

  // Fetch current month summary on the server
  const now = new Date();
  const monthStr = String(now.getMonth() + 1).padStart(2, "0");

  // Fetch current month summary on the server (direct internal call)
  headers.set("content-type", "application/json");
  const budgetRes = await fetch(`${url}/main.php?action=summary`, {
    method: "POST",
    headers,
    cache: "no-store",
    body: JSON.stringify({
      year: now.getFullYear(),
      month: monthStr,
      include_transactions: true,
    }),
  });

  if (budgetRes.status === 401) return redirect("/login");

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
  );
}
