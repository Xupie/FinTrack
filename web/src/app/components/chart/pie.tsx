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

export default function PieChart({ data }: { data: BudgetData }) {

    // group by category
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};
    data.transactions.forEach(tx => {
        const category = tx.category_name;
        const amount = parseFloat(tx.amount as string);

        if (tx.type === "income") {
            incomeByCategory[category] = (incomeByCategory[category] || 0) + amount;
        } else if (tx.type === "expense") {
            expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
        }
    });

    const allCategories = Array.from(new Set([
        ...Object.keys(incomeByCategory),
        ...Object.keys(expenseByCategory)
    ]));

    const incomeData = allCategories.map(cat => incomeByCategory[cat] || 0);
    const expenseData = allCategories.map(cat => expenseByCategory[cat] || 0);

    const chartData = {
        labels: allCategories,
        datasets: [
            {
                label: "Income",
                data: incomeData,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
            {
                label: "Expense",
                data: expenseData,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            }
        ]
    };

    return <Pie data={chartData} />;
}