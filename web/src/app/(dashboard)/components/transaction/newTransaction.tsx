"use client"

import { useEffect, useState } from "react";
import Button from "../../../components/buttons/button";
import ErrorBox from "../ui/error";
import CreateCategory from "../category/createCategory";

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

    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("none");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    const filteredCategories = type
        ? localCategories.filter(cat => cat.type === type)
        : [];

    function onCreateTransaction() {
        if (!amount.trim()) {
            return setError("Invalid amount");
        }
        if (isNaN(Number(amount))) {
            return setError("Invalid amount");
        }
        if (!type) {
            return setError("Invalid type");
        }
        if (category === "none") {
            return setError("Invalid category");
        }
        if (!description.trim()) {
            return setError("Invalid description");
        }

        setError("");
        createTransaction();
    }

    return (
        // Full-screen overlay
        <div className="mx-2 fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Modal container */}
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">

                <ErrorBox onClose={() => setError('')} text={error} />

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
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>


                    {/* Transaction type */}
                    <div className="flex text-foreground">
                        <label htmlFor="expense">
                            <input 
                                type="radio" 
                                name="type" 
                                id="expense" 
                                onChange={() => setType("expense")} 
                            />
                            Expense
                        </label>

                        <label htmlFor="income">
                            <input
                                type="radio" 
                                name="type" 
                                id="income" 
                                onChange={() => setType("income")} 
                            />
                            Income
                        </label>

                    </div>

                    {/* Category */}
                    <div className="flex">
                        <select onChange={(e) => setCategory(e.target.id)} name="category" id="category">
                            <option value="none">No category</option>
                            {filteredCategories.map(category => (
                                <option 
                                    key={category.id} 
                                    value={category.id}
                                >
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                        onClick={onCreateTransaction}
                    />
                </div>
            </div>

            {showNewCategory && <CreateCategory close={() => setShowNewCategory(false)} setCategories={setLocalCategories}/>}
        </div>
    )
}