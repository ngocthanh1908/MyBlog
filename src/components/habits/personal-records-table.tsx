import type { PersonalRecord } from "@/data/habits-data";

interface PersonalRecordsTableProps {
  records: PersonalRecord[];
}

/** Table displaying personal running records — responsive with horizontal scroll on mobile */
export function PersonalRecordsTable({ records }: PersonalRecordsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 text-left font-semibold text-muted">Event</th>
            <th className="pb-3 text-left font-semibold text-muted">Time</th>
            <th className="pb-3 text-left font-semibold text-muted">Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr
              key={record.event}
              className={`border-b border-border transition-colors duration-150 hover:bg-surface ${
                index % 2 === 0 ? "bg-transparent" : "bg-surface/50"
              }`}
            >
              <td className="py-3 font-medium">{record.event}</td>
              <td className="py-3 font-mono text-accent">{record.time}</td>
              <td className="py-3 text-muted">{record.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
