"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Transaction = {
    id: number;
    description: string;
    amount: string | number;
    type: string;
    created_at: string;
    category_name: string;
};

type BudgetData = {
    income: number;
    expense: number;
    nettobudjetti: number;
    transactions: Transaction[];
};

export default function PieChart({ data, chartType }: { data: BudgetData, chartType: string }) {

    // group by category
    const expenseByCategory: Record<string, number> = {};

    // only get wanted type
    data?.transactions?.forEach(tx => {
        if (tx.type !== chartType) return;

        const category = tx.category_name;
        const amount = parseFloat(tx.amount as string);

        expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
    });

    const categories = Object.keys(expenseByCategory);
    const expenseData = Object.values(expenseByCategory);

    const chartData = {
        labels: categories,
        datasets: [
            {
                label: `${chartType} by Category`,
                data: expenseData,
                backgroundColor: categories.map(() =>
                    `hsl(${Math.random() * 360}, 70%, 60%)`
                ), // random pleasant colors
                borderWidth: 1,
            }
        ]
    };

    return (
        <div>
            <h1 className='text-center text-lg'>{chartType.toUpperCase()}</h1>
            {
                /* TODO: check for category type */
                data?.transactions?.[0]
                    ? <Pie data={chartData} />
                    : <p className='text-center'>No Data found</p>
            }
        </div>

    );
}