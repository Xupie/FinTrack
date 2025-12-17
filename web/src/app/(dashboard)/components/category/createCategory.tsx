import Button from "@/app/components/buttons/button";
import { useState } from "react";

type Category = {
  category_name: string;
  id: number;
  type: string;
};

type CreateCategoryProps = {
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  close: () => void;
};

export default function CreateCategory({
  setCategories,
  close,
}: CreateCategoryProps) {
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<"income" | "expense">("expense");

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;

    const response = await fetch(`/api//main.php?action=add_category`, {
      method: "POST",
      body: JSON.stringify({
        category_name: newCatName,
        type: newCatType,
      }),
      credentials: "include",
    },
    );

    if (!response.ok) {
      console.log("error creating category");
      return;
    }

    const data = await response.json();

    const newCategory: Category = {
      id: data.category_id,
      category_name: newCatName,
      type: newCatType,
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCatName("");
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Category</h2>

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
            />{" "}
            Expense
          </label>

          <label>
            <input
              type="radio"
              name="newCatType"
              value="income"
              checked={newCatType === "income"}
              onChange={() => setNewCatType("income")}
            />{" "}
            Income
          </label>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            size="lg"
            text="Create"
            type="primary"
            onClick={handleCreateCategory}
          />
          <Button
            size="lg"
            text="Cancel"
            type="cancel"
            onClick={() => close()}
          />
        </div>
      </div>
    </div>
  );
}
