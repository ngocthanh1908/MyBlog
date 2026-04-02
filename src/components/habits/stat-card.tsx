import type { ReactNode } from "react";

interface StatCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
}

/** Small stat display card used in the habits page weekly summary */
export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center transition-colors duration-300 hover:border-accent">
      {icon && (
        <div className="mb-2 flex justify-center text-accent">{icon}</div>
      )}
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
