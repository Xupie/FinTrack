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
    <div className="bg-cancel flex justify-between items-center rounded-sm px-4 py-2 mx-auto my-3">
      <p>{text}</p>

      <button
        type="button"
        onClick={onClose}
        className="border-gray-400 cursor-pointer"
      >
        X
      </button>
    </div>
  );
}
