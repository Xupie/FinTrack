"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PieChart from "./components/chart/pie";
import NewTransaction from "./components/transaction/newTransaction";
import Image from "next/image";
import Calendar from "./components/calendar";
import Carousel from "./components/carousel";
import Mobile_nav from "./components/mobile_nav";

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
    const [selectedDate, setSelectedDate] = useState(new Date());

    const onClickNewTransaction = () => {
        setNewTransactionVisible(!newTransactionVisible);
    }

    useEffect(() => {
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
            setCategories(data);
        };

        getCategories();
    }, []);

    // Get new data when changing date
    useEffect(() => {
        async function getDashboardData() {
            const data = await getDataOfMonth(
                selectedDate.getMonth() + 1,
                selectedDate.getFullYear()
            );
            setBudget(data);
        }

        getDashboardData();
    }, [selectedDate]);

    // Returns data of month
    async function getDataOfMonth(month: number, year: number) {
        // Fix month that isnt 2 digit
        const monthStr = month.toString().padStart(2, "0");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=summary`, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                year: year,
                month: monthStr,
                include_transactions: true,
            }),
        });

        if (response.status === 401) {
            router.push("/login");
        }

        if (!response.ok) {
            console.log("Failed to fetch data");
        }

        return await response.json();
    }

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

        if (response.ok) {
            setNewTransactionVisible(false)
        }
    }

    if (!budget) return <p>loading...</p>

    return (
        <main className="max-w-7xl mx-auto">
            <Mobile_nav onClickNewTransaction={onClickNewTransaction}/>
            {newTransactionVisible && (
                <NewTransaction categories={categories} createTransaction={createTransaction} cancel={onClickNewTransaction} />
                
            )}
            <div className="sm:grid sm:grid-cols-2 m-4 sm:m-8">
                <div className="sm:max-w-2/3 p-6 mx-auto">
                    <Carousel>
                        <PieChart chartType="expense" data={{ ...budget }} />
                        <PieChart chartType="income" data={{ ...budget }} />
                    </Carousel>

                </div>
                <div className="bg-surface rounded-lg p-4">
                    <Calendar date={selectedDate} onChangeDate={setSelectedDate} />
                    {budget && (
                        <div className="mt-4">
                            <p>Tulot: {budget.income}</p>
                            <p>Menot: {budget.expense}</p>
                            <p>Budjetti: {budget.nettobudjetti}</p>
                            <div className="border-b-2 mt-3 rounded-2xl"></div>
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
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border bg-primary border-gray-300 p-2 text-left">Category</th>
                            <th className="border bg-primary border-gray-300 p-2 text-left">Income</th>
                            <th className="border bg-primary border-gray-300 p-2 text-left">Expense</th>
                            <th className="border bg-primary"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        Array.from(new Set(budget?.transactions?.map(t => t.category_name))).map((category) => {
                            const incomeTotal = budget?.transactions
                                ?.filter(t => t.category_name === category && t.type === 'income')
                                .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

                            const expenseTotal = budget?.transactions
                                ?.filter(t => t.category_name === category && t.type === 'expense')
                                .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

                            return (
                                <tr key={category} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2">{category}</td>
                                    <td className="border border-gray-300 p-2">{incomeTotal > 0 ? incomeTotal : '-'}</td>
                                    <td className="border border-gray-300 p-2">{expenseTotal > 0 ? expenseTotal : '-'}</td>
                                    <td className="border border-gray-300 p-2">
                                        <button type="button" className="cursor-pointer flex">
                                            <Image alt="edit" width={28} height={28} src={`/edit/edit.svg`} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    )
}