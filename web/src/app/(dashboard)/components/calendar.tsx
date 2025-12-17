"use client";

export default function Calendar({
  date,
  onChangeDate,
}: {
  date: Date;
  onChangeDate: (d: Date) => void;
}) {
  const formatMonth = (d: Date) => d.toLocaleString("en-US", { month: "long" });

  const changeMonth = (offset: number) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + offset);
    onChangeDate(newDate);
  };

  const handleInput = (e: any) => {
    const value = e.target.value; // "2025-07"
    if (!value) return;

    const [year, month] = value.split("-");
    onChangeDate(new Date(year, month - 1, 1));
  };

  return (
    <div className="flex flex-col">
      {/* visible formatted month */}
      <span className="text-center text-2xl">{formatMonth(date)}</span>

      <div className="flex">
        <button
          type="button"
          aria-label="Previous month"
          className="text-3xl font-bold"
          onClick={() => changeMonth(-1)}
        >
          {"<"}
        </button>

        <div className="flex grow items-center justify-center">
          {/* input */}
          <label htmlFor="month-picker" className="sr-only">
            Select month
          </label>
          <input
            id="month-picker"
            type="month"
            className="text-center"
            value={`${date.getFullYear()}-${String(
              date.getMonth() + 1,
            ).padStart(2, "0")}`}
            onChange={handleInput}
            aria-label="Select month"
          />
        </div>

        <button
          type="button"
          aria-label="Next month"
          className="text-3xl font-bold"
          onClick={() => changeMonth(1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
