import { useState } from "react";

export default function Calendar() {
    const [date, setDate] = useState(new Date());

    const formatMonth = (d: Date) =>
        d.toLocaleString("en-US", { month: "long" });

    const changeMonth = (offset: number) => {
        const newDate = new Date(date);
        newDate.setMonth(date.getMonth() + offset);
        setDate(newDate);
    };

    const handleInput = (e: any) => {
        const value = e.target.value; // "2025-07"
        if (!value) return;
        const [year, month] = value.split("-");
        setDate(new Date(year, month - 1, 1));
    };

    return (
        <div className="flex">
            <button className="text-3xl font-bold" onClick={() => changeMonth(-1)}>{"<"}</button>

            <div className="flex grow items-center justify-center">
                {/* visible formatted month */}
                <span style={{ margin: "0 10px" }}>{formatMonth(date)}</span>

                {/* input */}
                <input
                    type="month"

                    value={`${date.getFullYear()}-${String(
                        date.getMonth() + 1
                    ).padStart(2, "0")}`}
                    onChange={handleInput}
                />
            </div>

            <button className="text-3xl font-bold" onClick={() => changeMonth(1)}>{">"}</button>
        </div>
    )
}