"use client"

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
    const [transactions, setTransactions] = useState(initialTransactions);

    return (

        <main>

            {/* Categories */}
            <section>
                {categories.map((category) => {
                    
                    return (
                        <div>
                            <p>{category.category_name}</p>
                        </div>
                    )
                })}
            </section>

            {/* Transactions */}
            <section>
                {}
            </section>
        </main>
    )
}