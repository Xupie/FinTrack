"use client"

import { useEffect, useState } from "react";
import Button from "../../../components/buttons/button";

type Category = {
    category_name: string;
    id: number;
    type: string;
};

type NewTransactionProps = {
    categories: Category[];
    createTransaction: () => void;
    cancel: () => void;
};


export default function NewTransaction({ categories, createTransaction, cancel }: NewTransactionProps) {
    const [type, setType] = useState<"income" | "expense" | "">("");
    const [localCategories, setLocalCategories] = useState<Category[]>(categories);

    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [newCatType, setNewCatType] = useState<"income" | "expense">("expense");

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    const filteredCategories = type
        ? localCategories.filter(cat => cat.type === type)
        : [];

    const handleCreateCategory = async () => {
        if (!newCatName.trim()) return;

        let newCategory: Category = {
            id: Date.now(), // temp id
            category_name: newCatName,
            type: newCatType,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main.php?action=add_category`, {
            method: "POST",
            body: JSON.stringify({
                category_name: newCategory.category_name,
                type: newCategory.type,
            }),
            credentials: 'include'
        });

        const data = await response.json();
        // Change temp id to real id
        newCategory.id = data["category_id"]

        if (response.ok) {
            setLocalCategories(prev => [...prev, newCategory]);
            setShowNewCategory(false);
            setNewCatName("");
        }
        else {
            console.log("error creating category");
        }
    };

    return (
        // Full-screen overlay
        <div className="mx-2 fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Modal container */}
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
                <div className="flex flex-col mx-auto sm:w-3/5 gap-4">

                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="flex mb-1 font-medium text-foreground">
                            Amount
                        </label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            placeholder="123.45€"
                            className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>


                    {/* Transaction type */}
                    <div className="flex text-foreground">
                        <label htmlFor="expense">
                            <input type="radio" name="type" id="expense" onChange={() => setType("expense")} />
                            Expense
                        </label>

                        <label htmlFor="income">
                            <input type="radio" name="type" id="income" onChange={() => setType("income")} />
                            Income
                        </label>

                    </div>

                    {/* Category */}
                    <div className="flex">
                        <select name="category" id="category">
                            <option value="none">No category</option>

                            {filteredCategories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        <div className="flex ms-auto">
                            <Button size="sm" text="New Category" type="primary" onClick={() => setShowNewCategory(true)} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="flex mb-1 font-medium text-foreground">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Groceries..."
                            className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-around mt-4">
                    <Button
                        size="xl"
                        text="Cancel"
                        type="cancel"
                        onClick={cancel}
                    />
                    <Button
                        size="xl"
                        text="Create"
                        type="primary"
                        onClick={createTransaction}
                    />
                </div>
            </div>

            {showNewCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-surface p-6 rounded-lg w-full max-w-md shadow-lg">

                        <h2 className="text-lg font-semibold mb-4">Create New Category</h2>

                        {/* Category name */}
                        <input
                            type="text"
                            placeholder="Category name"
                            className="border w-full px-3 py-2 rounded mb-4"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                        />

                        {/* Category type */}
                        <div className="flex gap-4 mb-4">
                            <label>
                                <input
                                    type="radio"
                                    name="newCatType"
                                    value="expense"
                                    checked={newCatType === "expense"}
                                    onChange={() => setNewCatType("expense")}
                                /> Expense
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="newCatType"
                                    value="income"
                                    checked={newCatType === "income"}
                                    onChange={() => setNewCatType("income")}
                                /> Income
                            </label>
                        </div>

                        <div className="flex justify-between mt-4">
                            <Button
                                size="md"
                                text="Cancel"
                                type="cancel"
                                onClick={() => setShowNewCategory(false)}
                            />
                            <Button
                                size="md"
                                text="Create"
                                type="primary"
                                onClick={handleCreateCategory}
                            />
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}