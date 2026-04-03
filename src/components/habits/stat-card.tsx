import type { ReactNode } from "react";

interface StatCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
}

/** Stat display card with rounded-3xl design and hover lift */
export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="bg-surface rounded-3xl border border-border p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {icon && (
        <div className="mb-3 flex justify-center">
          <div className="bg-accent/10 p-2 rounded-xl text-accent">{icon}</div>
        </div>
      )}
      <p className="text-2xl font-extrabold text-primary">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted">{label}</p>
    </div>
  );
}
