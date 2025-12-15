"use client"

import Button from "@/app/components/buttons/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditModal from "../components/transaction/edit";

type categoryType = {
    category_name: string;
    id: number;
    type: string;
}[]

type transactionType = {
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

export default function ManagementClient({
    initialCategories,
    initialTransactions
}: {
    initialCategories: categoryType,
    initialTransactions: transactionType,
}) {
    const router = useRouter();

    const [categories, setCategories] = useState(initialCategories);
    const [transactions, setTransactions] = useState(initialTransactions.transactions);
    const [editMenuVisible, setEditMenuVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editType, setEditType] = useState<"transaction" | "category" | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<
        (typeof transactions)[number] | null
    >(null);
    const [selectedCategoryItem, setSelectedCategoryItem] = useState<
        (typeof categories)[number] | null
    >(null);

    const filteredTransactions = selectedCategory
        ? transactions.filter(tx => tx.type === selectedCategory)
        : transactions;

    function openTransactionEdit(transaction: (typeof transactions)[number]) {
        setSelectedTransaction(transaction);
        setEditType("transaction");
        setEditMenuVisible(true);
    }

    function openCategoryEdit(category: (typeof categories)[number]) {
        setSelectedCategoryItem(category);
        setEditType("category");
        setEditMenuVisible(true);
    }


    async function deleteCategory(id: number) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=delete_category`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                category_id: id
            }),
        });

        if (response.ok) {
            setCategories(categories.filter(cat => cat.id !== id));
        }
    }


    async function deleteTransaction(id: number) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=delete_transaction`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                category_id: id
            }),
        });

        if (response.ok) {
            setTransactions(transactions.filter((tx) => tx.id !== id));
        }
    }

    return (
        <main>

            <div className="m-4">
                <Button size="lg" text="Dashboard" type="primary" onClick={() => router.push("/dashboard")} />
            </div>

            <div className="sm:grid sm:grid-cols-2">
                {/* Categories */}
                <section className="overflow-x-auto m-4">
                    <h1>Categories</h1>
                    <table className="w-full table-fixed">
                        <thead>
                            <tr>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Category</th>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Type</th>
                                <th className="border bg-primary border-gray-300 p-2 flex justify-around"><span>Edit</span><span>List</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => {
                                return (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-2 max-w-xs truncate">{category.category_name}</td>
                                        <td className="border border-gray-300 p-2">{category.type}</td>
                                        <td className="border border-gray-300 p-2 flex justify-around">
                                            <button className="cursor-pointer" onClick={() => openCategoryEdit(category)}><Image alt="edit" width={28} height={28} src={`/edit/edit.svg`} /></button>
                                            <button className="cursor-pointer"><Image alt="list" width={28} height={28} src={`/hamburger-menu/hamburger-menu-white.svg`} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>

                {/* Transactions */}
                <section className="overflow-x-auto m-4">
                    <h1>Transactions</h1>
                    <select
                        name="transactionType"
                        id="transactionType"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="income">Incomes</option>
                        <option value="expense">Expenses</option>
                    </select>
                    <table className="w-full table-fixed">
                        <thead>
                            <tr>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Category</th>
                                <th className="hidden sm:table-cell border bg-primary border-gray-300 p-2 text-left">Type</th>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Description</th>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Amount</th>
                                <th className="border bg-primary border-gray-300 p-2 text-left">Created At</th>
                                <th className="border bg-primary border-gray-300 p-2 flex justify-around"><span>Edit</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2 max-w-xs truncate">{transaction.category_name}</td>
                                    <td className="border border-gray-300 p-2 max-w-xs truncate hidden sm:table-cell">{transaction.type}</td>
                                    <td className="border border-gray-300 p-2 max-w-xs truncate">{transaction.description}</td>
                                    <td className="border border-gray-300 p-2 max-w-xs truncate">{transaction.amount}</td>
                                    <td className="border border-gray-300 p-2 max-w-xs truncate">{transaction.created_at}</td>
                                    <td className="border border-gray-300 p-2 flex justify-around">
                                        <button className="cursor-pointer" onClick={() => openTransactionEdit(transaction)}><Image alt="edit" width={28} height={28} src={`/edit/edit.svg`} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {editMenuVisible && editType === "transaction" && selectedTransaction && (
                <EditModal
                    type="transaction"
                    data={selectedTransaction}
                    setTransactions={setTransactions}
                    categories={categories}
                    close={() => setEditMenuVisible(false)}
                />
            )}

            {editMenuVisible && editType === "category" && selectedCategoryItem && (
                <EditModal
                    type="category"
                    data={selectedCategoryItem}
                    setCategories={setCategories}
                    close={() => setEditMenuVisible(false)}
                />
            )}

        </main>
    )
}