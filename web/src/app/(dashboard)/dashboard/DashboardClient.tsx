"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NavigationDesktop } from "../components/navigation";
import Carousel from "../components/carousel";
import PieChart from "../components/chart/pie";
import Calendar from "../components/calendar";
import Image from "next/image";
import Navigation from "../components/navigation";
import ListCategory from "../components/category/listCategory";

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
        category_id: number;
    }[]
}

type categoryType = {
    category_name: string;
    id: number;
    type: string;
}[]

export default function DashboardClient({
    initialBudget,
    initialCategories,
    initialDate,
}: {
    initialBudget: budgetType | null;
    initialCategories: categoryType;
    initialDate: Date;
}) {

    const router = useRouter();
    const [budget, setBudget] = useState<budgetType | null>(initialBudget);
    const [categories, setCategories] = useState<categoryType>(initialCategories);
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [listMenuVisible, setListMenuVisible] = useState(false);
    const [selectedCategoryItem, setSelectedCategoryItem] = useState<
        (typeof categories)[number] | null
    >(null);
    const firstRender = useRef(true);

    // Get new data when changing date
    useEffect(() => {
        if (firstRender.current) {
            // Skip the first run
            firstRender.current = false;
            return;
        }

        if (!selectedDate) return;

        async function getDashboardData() {
            if (selectedDate === null) return;
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

        if (response.status === 401) router.push("/login");

        if (!response.ok) {
            console.log("Failed to fetch data");
        }

        return await response.json();
    }

    function openListCategory(category: (typeof categories)[number]) {
        setSelectedCategoryItem(category);
        setListMenuVisible(true);
    }

    if (!budget) return <p>loading...</p>

    return (
        <>

            <Navigation categories={categories} />

            <main className="max-w-7xl mx-auto">

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
                            <div className="flex flex-col mt-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs sm:text-sm text-muted">Income</p>
                                        <p className="text-lg sm:text-2xl font-semibold">
                                            {budget.income}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-sm text-muted">Expenses</p>
                                        <p className="text-lg sm:text-2xl font-semibold">
                                            {budget.expense}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs sm:text-sm text-muted">Budget</p>
                                        <p className="text-xl sm:text-2xl font-bold">
                                            {budget.nettobudjetti}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden sm:block mt-16">
                                    <NavigationDesktop categories={categories} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="mb-20 mx-4 sm:m-8 overflow-x-auto">
                    <table className="w-full table-fixed border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border bg-primary border-gray-300 p-2 text-left">Category</th>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Expense</th>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Income</th>
                                <th className="border bg-primary hidden sm:table-cell">List</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from(new Set(budget?.transactions?.map(t => t.category_name))).map((category) => {
                                const incomeTotal = budget?.transactions
                                    ?.filter(t => t.category_name === category && t.type === 'income')
                                    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

                                const expenseTotal = budget?.transactions
                                    ?.filter(t => t.category_name === category && t.type === 'expense')
                                    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

                                return (
                                    <tr key={category} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-2 max-w-xs truncate">{category}</td>
                                        <td className="border border-gray-300 p-2">{expenseTotal > 0 ? expenseTotal : '-'}</td>
                                        <td className="border border-gray-300 p-2">{incomeTotal > 0 ? incomeTotal : '-'}</td>
                                        <td className="border border-gray-300 p-2 hidden sm:table-cell">
                                            <button type="button" className="cursor-pointer mx-auto flex" onClick={() => openListCategory(categories.find(c => c.category_name === category) || categories[0])}>
                                                <Image alt="edit" width={28} height={28} src={`/hamburger-menu/hamburger-menu-white.svg`} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {listMenuVisible && selectedCategoryItem && (
                    <ListCategory
                        category={selectedCategoryItem}
                        close={() => setListMenuVisible(false)}
                    />
                )}
            </main>
        </>
    )
}