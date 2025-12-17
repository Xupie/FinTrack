"use client";

import { useState } from "react";
import ErrorBox from "../../../components/error";
import Button from "@/app/components/buttons/button";
import Image from "next/image";
import DeleteConfirm from "../ui/delete_confirmation";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: string;
  created_at: string;
  category_id: number;
  category_name: string;
};

type Category = {
  id: number;
  category_name: string;
  type: string;
};

type EditTransactionProps = {
  transaction: Transaction;
  categories: Category[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  close: () => void;
};

export default function EditTransaction({
  transaction,
  categories,
  setTransactions,
  close,
}: EditTransactionProps) {
  const [error, setError] = useState("");
  const [localTransaction, setLocalTransaction] = useState<Transaction>(transaction);
  const [ellipsisMenuVisible, setEllipsisMenuVisible] = useState<boolean>(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false);

  async function editTransaction() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/main.php?action=update_transaction`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          id: localTransaction.id,
          description: localTransaction.description,
          category: localTransaction.category_id,
          amount: localTransaction.amount,
        }),
      },
    );

    if (response.ok) {
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === localTransaction.id
            ? localTransaction
            : tx,
        ),
      );
      close();
    }
  }

  async function deleteTransaction() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/main.php?action=delete_transaction`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          id: localTransaction.id,
        }),
      },
    );

    if (response.ok) {
      setTransactions((prev) =>
        prev.filter((tx) => tx.id === localTransaction.id),
      );
    }
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
    if (Number.isNaN(Number(localTransaction?.amount))) {
      return setError("Invalid amount");
    }

    setError("");
    editTransaction();
  }

  function handleDelete() {
    deleteTransaction();
    setDeleteConfirmVisible(false);
    close();
  }

  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">

        {deleteConfirmVisible && (
          <DeleteConfirm
            onConfirm={() => handleDelete()}
            onCancel={() => setDeleteConfirmVisible(!deleteConfirmVisible)}
            text={`Are you sure you want to delete transaction: '${localTransaction.description}'?`}
          />
        )}

        <div className="flex mb-4">
          <h1 className="text-2xl font-bold">Edit Transaction</h1>

          {/* Eclipsis menu / 3 dots */}
          <div className="relative ms-auto">
            <button
              type="button"
              className="cursor-pointer ms-auto flex"
              onClick={() => setEllipsisMenuVisible(!ellipsisMenuVisible)}
            >
              <Image
                src={`edit-dots.svg`}
                alt="edit-dots"
                height={25}
                width={25}
              />
            </button>
            {ellipsisMenuVisible && (
              <div className="p-1 bg-surface2 rounded-sm">
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setDeleteConfirmVisible(true)}
                >
                  Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* Amount */}
        <label
          htmlFor="transaction_amount"
          className="flex mb-1 font-medium text-foreground"
        >
          Amount
        </label>
        <input
          type="text"
          id="transaction_amount"
          name="transaction_amount"
          placeholder=""
          className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
          value={localTransaction.amount}
          onChange={(e) =>
            setLocalTransaction({
              ...localTransaction,
              amount: parseFloat(e.target.value),
            })
          }
        />

        {/* Category type */}
        <div className="flex text-foreground">
          <label htmlFor="expense">
            <input
              type="radio"
              name="type"
              id="expense"
              checked={localTransaction.type === "expense"}
              onChange={(e) =>
                setLocalTransaction({ ...localTransaction, type: e.target.id })
              }
            />
            Expense
          </label>

          <label htmlFor="income">
            <input
              type="radio"
              name="type"
              id="income"
              checked={localTransaction.type === "income"}
              onChange={(e) =>
                setLocalTransaction({ ...localTransaction, type: e.target.id })
              }
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
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>

        {/* Description */}
        <label
          htmlFor="transaction_description"
          className="flex mb-1 font-medium text-foreground"
        >
          Description
        </label>
        <input
          type="text"
          id="transaction_description"
          name="transaction_description"
          placeholder=""
          className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
          value={localTransaction.description}
          onChange={(e) =>
            setLocalTransaction({
              ...localTransaction,
              description: e.target.value,
            })
          }
        />

        <ErrorBox onClose={() => setError("")} text={error} />

        {/* Buttons */}
        <div className="flex justify-around mt-4">
          <Button
            size="xl"
            text="Update"
            type="primary"
            onClick={handleTransactionUpdate}
          />
          <Button
            size="xl"
            text="Cancel"
            type="cancel"
            onClick={close}
          />
        </div>
      </div>
    </div>
  );
}
