// Habits page data — running stats, records, goals, philosophy

export interface PersonalRecord {
  event: string;
  time: string;
  date: string;
}

export interface CurrentGoal {
  goal: string;
  target: string;
  current: string;
}

export const latestRun = {
  date: "2026-03-30",
  distance: "10 km",
  pace: "6:15 /km",
  avgHR: 135,
  notes: "Easy MAF run along the river",
};

export const weeklyStats = {
  totalDistance: "32 km",
  totalRuns: 4,
  avgPace: "6:20 /km",
};

export const personalRecords: PersonalRecord[] = [
  { event: "5K", time: "24:30", date: "2025-11-15" },
  { event: "10K", time: "52:45", date: "2025-12-08" },
  { event: "Half Marathon", time: "2:05:30", date: "2026-02-16" },
  { event: "Marathon", time: "4:35:00", date: "2026-01-12" },
];

export const currentGoals: CurrentGoal[] = [
  { goal: "Weekly Mileage", target: "40 km", current: "32 km" },
  { goal: "Sub-4:15 Marathon", target: "Apr 2026", current: "Training" },
  { goal: "MAF HR Zone", target: "<140 bpm", current: "135 avg" },
];

export const philosophy =
  "The miracle isn't that I finished. The miracle is that I had the courage to start.";
