"use client";

import { useState } from "react";

export function FontSizer() {
  const [size, setSize] = useState(1.05);

  function change(delta: number) {
    const next = Math.min(1.3, Math.max(0.9, size + delta * 0.05));
    setSize(next);
    document.documentElement.style.setProperty("--reading-font-size", `${next}rem`);
  }

  return (
    <div className="flex items-center gap-2 text-[0.85rem] text-muted font-semibold">
      <span>Cỡ chữ:</span>
      <button
        onClick={() => change(-1)}
        className="bg-surface border border-border px-2.5 py-1 rounded-md text-primary font-bold hover:border-accent transition-colors"
        aria-label="Giảm cỡ chữ"
      >
        A-
      </button>
      <button
        onClick={() => change(1)}
        className="bg-surface border border-border px-2.5 py-1 rounded-md text-primary font-bold hover:border-accent transition-colors"
        aria-label="Tăng cỡ chữ"
      >
        A+
      </button>
    </div>
  );
}
