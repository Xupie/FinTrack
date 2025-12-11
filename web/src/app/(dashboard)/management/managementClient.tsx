"use client"

import Image from "next/image";
import { useState } from "react";

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
    }[]
}

export default function ManagementClient({
    initialCategories,
    initialTransactions
}: {
    initialCategories: categoryType,
    initialTransactions: transactionType,
}) {
    const [categories, setCategories] = useState(initialCategories);
    const [transactions, setTransactions] = useState(initialTransactions.transactions);

    async function deleteCategory(id: number) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=delete_category`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                category_id: id
            }),
        });

        if (response.ok) {
            setCategories(transactions.filter((tx) => tx.id !== id));
        }
    }

    async function editCategory(id: number, category_name: string, type: string,) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=update_category`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                category_id: id,
                category_name,
                type,
            }),
        });

        if (response.ok) {
            setCategories(
                categories.map((category) =>
                    category.id === id ? { ...category, category_name: category_name, type: type } : category
                )
            );
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

    async function editTransaction(transaction_id: number, description: string, category_id: string, amount: number,) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=update_transaction`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: transaction_id,
                description,
                category_id,
                amount,
            }),
        });

        if (response.ok) {
            setTransactions(
                transactions.map((transaction) =>
                    transaction.id === transaction_id ? { ...transaction, description: description, category_id: category_id, amount: amount } : transaction
                )
            );
        }
    }

    return (
        <main>

            {/* Categories */}
            <section className="overflow-x-auto m-4">
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
                                    <td className="border border-gray-300 p-2">-</td>
                                    <td className="border border-gray-300 p-2 flex justify-around">
                                        <button className="cursor-pointer"><Image alt="edit" width={28} height={28} src={`/edit/edit.svg`} /></button>
                                        <button className="cursor-pointer"><Image alt="list" width={28} height={28} src={`/navigation/list.svg`}/></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            {/* Transactions */}
            <section>
                { }
            </section>
        </main>
    )
}