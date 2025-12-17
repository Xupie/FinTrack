import { useState } from "react";
import ErrorBox from "../ui/error";
import Button from "@/app/components/buttons/button";
import Image from "next/image";

type Category = {
  id: number;
  category_name: string;
  type: string;
};

type EditCategoryProps = {
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  close: () => void;
};

export default function EditCategory({
  setCategories,
  close,
  category,
}: EditCategoryProps) {
  const [error, setError] = useState("");
  const [localCategory, setLocalCategory] = useState<Category>(category);

  async function editCategory() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/main.php?action=update_category`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          category_id: localCategory.id,
          category_name: localCategory.category_name,
          type: localCategory.type,
        }),
      },
    );

    if (response.ok) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === localCategory.id ? localCategory : category,
        ),
      );
      close();
    }
  }

  async function deleteCategory(id: number) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/main.php?action=delete_category`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          category_id: id,
        }),
      },
    );

    if (response.ok) {
      setCategories((prev) =>
        prev.filter((category) => category.id === localCategory.id),
      );
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

  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
        <ErrorBox onClose={() => setError("")} text={error} />

        <div className="flex mb-4">
          <h1 className="text-2xl font-bold">Edit Category</h1>
          <button type="button" className="flex ms-auto cursor-pointer">
            <Image
              src={`edit-dots.svg`}
              alt="edit-dots"
              height={25}
              width={25}
            />
          </button>
        </div>

        {/* Category Name */}
        <label
          htmlFor="category_name"
          className="flex mb-1 font-medium text-foreground"
        >
          Category Name
        </label>
        <input
          type="text"
          id="category_name"
          name="category_name"
          placeholder=""
          className="border text-background bg-foreground border-gray-300 rounded-lg px-3 py-2"
          value={localCategory.category_name}
          onChange={(e) =>
            setLocalCategory({
              ...localCategory,
              category_name: e.target.value,
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
              checked={localCategory.type === "expense"}
              onChange={(e) =>
                setLocalCategory({ ...localCategory, type: e.target.id })
              }
            />
            Expense
          </label>

          <label htmlFor="income">
            <input
              type="radio"
              name="type"
              id="income"
              checked={localCategory.type === "income"}
              onChange={(e) =>
                setLocalCategory({ ...localCategory, type: e.target.id })
              }
            />
            Income
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-around mt-4">
          <Button size="lg" text="Cancel" type="cancel" onClick={close} />
          <Button
            size="lg"
            text="Update"
            type="primary"
            onClick={handleCategoryUpdate}
          />
        </div>
      </div>
    </div>
  );
}
