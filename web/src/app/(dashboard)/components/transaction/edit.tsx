"use client"

import { useEffect, useState } from "react";
import ErrorBox from "../ui/error";
import Button from "@/app/components/buttons/button";

export const modalTypes = ["category", "transaction"];
type modalType = (typeof modalTypes)[number]

type Transaction = {
    id: number;
    description: string;
    amount: number;
    type: string;
    created_at: string;
    category_id: number;
    category_name: string;
};

type transactionType = {
    income: number;
    expense: number;
    nettobudjetti: number;
    transactions: Transaction[]
}

type Category = {
    id: number;
    category_name: string;
    type: string;
};

type EditModalProps =
    | {
        type: "transaction";
        data: Transaction;
        categories: Category[];
        setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
        close: () => void;
    }
    | {
        type: "category";
        data: Category;
        setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
        close: () => void;
    };

export default function EditModal(props: EditModalProps) {
    const [error, setError] = useState("");

    const [localTransaction, setLocalTransaction] = useState<Transaction | null>(
        props.type === "transaction" ? props.data : null
    );

    const [localCategory, setLocalCategory] = useState<Category | null>(
        props.type === "category" ? props.data : null
    );

    async function editTransaction() {
        if (props.type !== "transaction" || !localTransaction) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=update_transaction`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: localTransaction.id,
                description: localTransaction.description,
                category: localTransaction.category_id,
                amount: localTransaction.amount,
            }),
        });

        if (response.ok) {
            props.setTransactions((prev) =>
                prev.map((transaction) =>
                    transaction.id === localTransaction.id
                        ? localTransaction
                        : transaction
                )
            );
            props.close();
        }
    }

    async function editCategory() {
        if (props.type !== "category" || !localCategory) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=update_category`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                category_id: localCategory.id,
                category_name: localCategory.category_name,
                type: localCategory.type,
            }),
        });

        if (response.ok) {
            props.setCategories((prev) =>
                prev.map((category) =>
                    category.id === localCategory.id
                        ? localCategory
                        : category
                )
            );
            props.close();
        }
    }

    function handleCategoryUpdate() {
        if (!localCategory?.category_name.trim()) {
            return setError("No category name");
        }
        if (!localCategory?.type.trim()) {
            return setError("No category type");
        }

        setError("");
        editCategory();
    }

    function handleTransactionUpdate() {
        if (!localTransaction?.category_id) {
            return setError("No category id");
        }
        if (!localTransaction?.type) {
            return setError("No category type");
        }
        if (!localTransaction?.description.trim()) {
            return setError("No category description");
        }
        if (isNaN(Number(localTransaction?.amount))) {
            return setError("Invalid amount");
        }

        setError("");
        editTransaction();
    }

    return (
        // Full-screen overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Modal container */}
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
                <ErrorBox onClose={() => setError('')} text={error} />

                {localCategory && props.type === "category"
                    ? (
                        <div>

                            {/* Category Name */}
                            <label htmlFor="category_name" className="flex mb-1 font-medium text-foreground">Category Name</label>
                            <input
                                type="text"
                                id="category_name"
                                name="category_name"
                                placeholder=""
                                className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                                value={localCategory.category_name}
                                onChange={(e) => setLocalCategory({ ...localCategory, category_name: e.target.value })}
                            />

                            {/* Category type */}
                            <div className="flex text-foreground">
                                <label htmlFor="expense">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="expense"
                                        checked={localCategory.type === "expense"}
                                        onChange={(e) => setLocalCategory({ ...localCategory, type: e.target.id })}
                                    />
                                    Expense
                                </label>

                                <label htmlFor="income">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="income"
                                        checked={localCategory.type === "income"}
                                        onChange={(e) => setLocalCategory({ ...localCategory, type: e.target.id })}
                                    />
                                    Income
                                </label>
                            </div>
                        </div>
                    )
                    : localTransaction && props.type === "transaction" ? (
                        <div>
                            {/* Amount */}
                            <label htmlFor="transaction_amount" className="flex mb-1 font-medium text-foreground">Amount</label>
                            <input
                                type="text"
                                id="transaction_amount"
                                name="transaction_amount"
                                placeholder=""
                                className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                                value={localTransaction.amount}
                                onChange={(e) => setLocalTransaction({ ...localTransaction, amount: parseFloat(e.target.value) })}
                            />

                            {/* Category type */}
                            <div className="flex text-foreground">
                                <label htmlFor="expense">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="expense"
                                        checked={localTransaction.type === "expense"}
                                        onChange={(e) => setLocalTransaction({ ...localTransaction, type: e.target.id })}
                                    />
                                    Expense
                                </label>

                                <label htmlFor="income">
                                    <input
                                        type="radio"
                                        name="type"
                                        id="income"
                                        checked={localTransaction.type === "income"}
                                        onChange={(e) => setLocalTransaction({ ...localTransaction, type: e.target.id })}
                                    />
                                    Income
                                </label>
                            </div>

                            {/* Category */}
                            <select
                                value={localTransaction.category_id}
                                onChange={(e) =>
                                    setLocalTransaction({
                                        ...localTransaction,
                                        category_id: Number(e.target.value),
                                    })
                                }
                            >
                                {props.categories.map((category) => (

                                    <option key={category.id} value={category.id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>


                            {/* Description */}
                            <label htmlFor="transaction_description" className="flex mb-1 font-medium text-foreground">Description</label>
                            <input
                                type="text"
                                id="transaction_description"
                                name="transaction_description"
                                placeholder=""
                                className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                                value={localTransaction.description}
                                onChange={(e) => setLocalTransaction({ ...localTransaction, description: e.target.value })}
                            />
                        </div>
                    )
                        : <></>
                }

                {/* Buttons */}
                <div className="flex justify-around mt-4">
                    <Button
                        size="xl"
                        text="Cancel"
                        type="cancel"
                        onClick={props.close}
                    />
                    <Button
                        size="xl"
                        text="Update"
                        type="primary"
                        onClick={
                            props.type === "transaction"
                                ? handleTransactionUpdate
                                : handleCategoryUpdate
                        }
                    />
                </div>
            </div>
        </div>
    )
}