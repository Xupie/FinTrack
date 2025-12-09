"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PieChart from "../components/chart/pie";
import NewTransaction from "../components/transaction/newTransaction";
import Image from "next/image";
import Calendar from "../components/calendar";

type budgetType = {
    income: number;
    expense: number;
    nettobudjetti: number;
    transactions: {
        id: number;
        description: string;
        amount: number;
        type: string;
        created_at: string;
        category_name: string;
    }[]
}

type categoryType = {
    category_name: string;
    id: number;
    type: string;
}[]

export default function Dashboard() {
    const router = useRouter();

    const [newTransactionVisible, setNewTransactionVisible] = useState(false);
    const [budget, setBudget] = useState<budgetType | null>(null);
    const [categories, setCategories] = useState<categoryType>([]);

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
                    month: date.getMonth() + 1,
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
            setBudget(data);
        };

        async function getCategories() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=show_categories`, {
                method: "GET",
                credentials: 'include',
            });

            if (response.status === 401) {
                router.push("/login");
            }

            if (!response.ok) {
                console.error("Failed to fetch category data");
            }

            const data = await response.json();
            console.log(data)
            setCategories(data);
        };
        
        getCategories();
        getDashboardData();
    }, []);

    async function createTransaction() {

        const amount = (document.querySelector("input[name=amount]") as HTMLInputElement).value;
        const type = (document.querySelector("input[name=type]:checked") as HTMLInputElement).id;
        const category = (document.querySelector("select[name=category]") as HTMLSelectElement).value;
        const description = (document.querySelector("input[name=description]") as HTMLInputElement).value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=add_transaction`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                amount: amount,
                type: type,
                category: category,
                description: description,
            }),
        });

        const data = await response.json();
        console.log(data)

    }

    if (!budget) return <p>loading...</p>

    return (
        <main className="max-w-7xl mx-auto">
            {newTransactionVisible && (
                <NewTransaction categories={categories} createTransaction={createTransaction} cancel={onClickNewTransaction} />
            )}
            <div className="sm:grid sm:grid-cols-2 m-4 sm:m-8">
                <div className="sm:max-w-2/3 p-6 mx-auto">
                    <PieChart data={{ ...budget }} />
                </div>
                <div className="bg-surface rounded-lg p-4">
                    <Calendar />
                    {budget && (
                        <div>
                            <p>Tulot: {budget.income}</p>
                            <p>Menot: {budget.expense}</p>
                            <p>Budjetti: {budget.nettobudjetti}</p>
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
                        </div>


                    )}
                </div>
            </div>

            <div className="m-4 sm:m-8">
                {budget?.transactions?.map((transaction, index) => (
                    <p key={transaction.id}>{transaction.amount}</p>
                ))}
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