"use client";

import Modal from "./modal";

export default function DeleteConfirm({
  visible,
  onCancel,
  onConfirm,
  text,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  text: string;
}) {
  return (
    <Modal visible={visible} onClose={onCancel}>
      <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
      <p className="mb-4">{text}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
