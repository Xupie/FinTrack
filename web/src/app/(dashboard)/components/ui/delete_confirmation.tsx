"use client";

import Button from "@/app/components/buttons/button";

export default function DeleteConfirm({
  onCancel,
  onConfirm,
  text = "Are you sure you want to delete this item? This action cannot be undone.",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  text?: string;
}) {
  return (
    // Full-screen overlay
    <div className="mx-2 fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-cancel">Delete Confirmation</h2>
        <p className="mb-4 text-md">{text}</p>

        <div className="flex justify-start gap-6 ">
          <Button type="cancel" size="lg" text="Delete" onClick={onConfirm} />
          <Button type="secondary" size="lg" text="Cancel" onClick={onCancel} />
        </div>
      </div>
    </div>

  );
}
