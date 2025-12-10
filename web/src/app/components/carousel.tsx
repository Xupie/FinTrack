"use client";

import { ReactNode, useState, Children, useEffect } from "react";

type CarouselProps = {
    children: ReactNode
};

export default function Carousel({ children }: CarouselProps) {
    const [current, setCurrent] = useState(0);
    const slides = Children.toArray(children);
    const length = slides.length;

    const next = () => {
        setCurrent((prev) => (prev + 1) % length);
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + length) % length);
    };

    return (
        <div className="relative w-full h-96 overflow-hidden">

            {/* SLIDES WRAPPER */}
            <div
                className="flex h-full transition-transform duration-500"
                style={{
                    width: `${length * 100}%`,         // total width = #slides * full width
                    transform: `translateX(-${current * (100 / length)}%)`
                }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="relative h-96 shrink-0 p-2"
                        style={{
                            width: `${100 / length}%`,     // each slide takes equal fraction
                        }}
                    >
                        {slide}
                    </div>
                ))}
            </div>

            {/* LEFT BUTTON */}
            <button
                type="button"
                onClick={prev}
                className="absolute px-5 left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white py-2 rounded-full hover:bg-black/70"
            >
                ‹
            </button>

            {/* RIGHT BUTTON */}
            <button
                type="button"
                onClick={next}
                className="absolute px-5 right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white py-2 rounded-full hover:bg-black/70"
            >
                ›
            </button>

            {/* DOTS */}
            <div className="absolute bottom-3 w-full flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full ${current === index ? "bg-white" : "bg-white/40"}`}
                    />
                ))}
            </div>
        </div>
    );
}