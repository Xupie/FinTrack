"use client";

export default function ErrorBox({
  onClose,
  text,
}: {
  onClose: () => void;
  text: string;
}) {
  if (!text) return null;

  return (
    <div className="bg-cancel flex justify-between items-center">
      <p>{text}</p>

      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border-gray-400 cursor-pointer"
      >
        X
      </button>
    </div>
  );
}
