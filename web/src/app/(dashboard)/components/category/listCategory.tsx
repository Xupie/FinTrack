import { useEffect, useState } from "react";
import Button from "@/app/components/buttons/button";

type Category = {
  id: number;
  category_name: string;
  type: string;
};

type ListCategoryProps = {
  category: Category;
  close: () => void;
};

type transactionType = {
  id: number;
  description: string;
  amount: number;
  type: string;
  created_at: string;
  category_name: string;
  category_id: number;
};

export default function ListCategory({ close, category }: ListCategoryProps) {
  const [transactions, setTransactions] = useState<transactionType[] | null>(
    null,
  );

  useEffect(() => {
    async function getTransactions() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/main.php?action=sorted_by_categories`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            category_id: category.id,
          }),
        },
      );
      setTransactions(await response.json());
    }
    getTransactions();
  }, [category]);

  if (!transactions) <p>loading...</p>;

  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
        <div className="flex mx-4">
          <h1 className="text-2xl font-bold">List of transactions</h1>
          <div className="flex ms-auto">
            <Button size="lg" text="Close" type="cancel" onClick={close} />
          </div>
        </div>

        {/* Desktop */}
        <section className="hidden md:block overflow-x-auto m-4">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th className="border bg-primary p-2 text-left">Category</th>
                <th className="border bg-primary p-2 text-left">Description</th>
                <th className="border bg-primary p-2 text-left">Amount</th>
                <th className="border bg-primary p-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="border p-2">{transaction.category_name}</td>
                  <td className="border p-2">{transaction.description}</td>
                  <td className="border p-2">{transaction.amount}</td>
                  <td className="border p-2">{transaction.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Mobile */}
        <section className="md:hidden space-y-3 mt-4">
          {transactions?.map((t) => (
            <div key={t.id} className="border rounded-lg px-4 py-2 bg-surface2">
              <div className="text-lg mt-1">{t.description}</div>

              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold">{t.amount}</span>
                <span className="text-xs text-gray-400">{t.created_at}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
