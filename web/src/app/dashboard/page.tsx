"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PieChart from "../components/chart/pie";
import NewTransaction from "../components/transaction/newTransaction";
import Image from "next/image";
import Calendar from "../components/calendar";

export default function Dashboard() {
    const router = useRouter();

    const [newTransactionVisible, setNewTransactionVisible] = useState(false);
    const [budget, setBudget] = useState([]);

    const onClickNewTransaction = () => {
        setNewTransactionVisible(!newTransactionVisible);
    }

    useEffect(() => {
        async function getDashboardData() {
            const date = new Date();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=summary`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify({
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    include_transactions: true,
                }),
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

    async function createTransaction() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=add_transaction`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                
            }),
        });
        
    }

    return (
        <main className="max-w-7xl mx-auto">
            {newTransactionVisible && (
                <NewTransaction createTransaction={createTransaction} cancel={onClickNewTransaction} />
            )}
            <div className="sm:grid sm:grid-cols-2 m-4 sm:m-8 ">
                <div className="sm:max-w-2/3 p-6 mx-auto">
                    <PieChart />
                </div>
                <div className="bg-surface rounded-lg p-4">
                    <Calendar />
                    {budget && (
                        <div>
                            <p>{budget}</p>
                        </div>
                    )}
                </div>
            </div>

            <div>

            </div>


            {/* mobile nav */}
            <div className="sm:collapse fixed bottom-0 left-0 right-0 z-50">
                <div className="mx-auto bg-surface px-6 flex justify-around items-center">
                    <button
                        className=""
                        type="button"
                        onClick={() => router.push("/dashboard")}
                    >
                        <Image
                            src={`/mobile-nav/home.svg`}
                            alt="home"
                            width={28}
                            height={28}
                        />
                    </button>
                    <button
                        type="button"
                        onClick={onClickNewTransaction}
                        className="relative rounded-2xl bg-primary p-2 my-4"
                    >
                        <Image
                            src="/mobile-nav/plus-white.svg"
                            alt="create new transaction"
                            width={28}
                            height={28}
                        />
                    </button>

                    <button type="button">
                        <Image src="/mobile-nav/settings.svg" alt="settings" width={28} height={28} />
                    </button>
                </div>
            </div>
        </main>
    )
}