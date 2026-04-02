import type { Metadata } from "next";
import { Activity, MapPin, Timer, Heart, Target } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import { StatCard } from "@/components/habits/stat-card";
import { PersonalRecordsTable } from "@/components/habits/personal-records-table";
import {
  latestRun,
  weeklyStats,
  personalRecords,
  currentGoals,
  philosophy,
} from "@/data/habits-data";

export const metadata: Metadata = {
  title: "Habits",
  description:
    "Running logs, personal records, weekly stats, and training goals from a marathon runner.",
  openGraph: {
    images: [
      {
        url: "/og?title=Habits+%26+Running&description=Running+logs%2C+personal+records%2C+and+training+goals",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function HabitsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-12">

      {/* Heading */}
      <FadeUp>
        <div className="flex items-center gap-3">
          <Activity size={28} className="text-accent" />
          <h1 className="text-3xl font-bold">Running &amp; Habits</h1>
        </div>
        <p className="mt-2 text-muted">
          Tracking progress one kilometre at a time.
        </p>
      </FadeUp>

      {/* Latest Run */}
      <FadeUp delay={0.1}>
        <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest Run</h2>
            <span className="text-sm text-muted">{latestRun.date}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{latestRun.distance}</p>
              <p className="text-xs text-muted">Distance</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{latestRun.pace}</p>
              <p className="text-xs text-muted">Pace</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{latestRun.avgHR}</p>
              <p className="text-xs text-muted">Avg HR (bpm)</p>
            </div>
          </div>
          <p className="mt-4 text-sm italic text-muted">{latestRun.notes}</p>
        </div>
      </FadeUp>

      {/* Weekly Summary */}
      <FadeUp delay={0.15}>
        <h2 className="mb-4 text-lg font-semibold">Weekly Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            value={weeklyStats.totalDistance}
            label="Total Distance"
            icon={<MapPin size={16} />}
          />
          <StatCard
            value={String(weeklyStats.totalRuns)}
            label="Runs This Week"
            icon={<Activity size={16} />}
          />
          <StatCard
            value={weeklyStats.avgPace}
            label="Avg Pace"
            icon={<Timer size={16} />}
          />
        </div>
      </FadeUp>

      {/* Personal Records */}
      <FadeUp delay={0.2}>
        <div className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent">
          <h2 className="mb-4 text-lg font-semibold">Personal Records</h2>
          <PersonalRecordsTable records={personalRecords} />
        </div>
      </FadeUp>

      {/* Current Goals */}
      <FadeUp delay={0.25}>
        <h2 className="mb-4 text-lg font-semibold">Current Goals</h2>
        <div className="space-y-3">
          {currentGoals.map((item) => (
            <div
              key={item.goal}
              className="rounded-xl border border-border bg-surface p-4 transition-colors duration-300 hover:border-accent"
            >
              <div className="flex items-start gap-3">
                <Target size={16} className="mt-0.5 shrink-0 text-accent" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.goal}</p>
                  <div className="mt-1 flex items-center gap-4 text-sm">
                    <span className="text-muted">
                      Target:{" "}
                      <span className="font-medium text-primary">
                        {item.target}
                      </span>
                    </span>
                    <span className="text-muted">
                      Now:{" "}
                      <span className="font-medium text-accent">
                        {item.current}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Philosophy quote */}
      <FadeUp delay={0.3}>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-6">
          <Heart size={18} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-sm italic text-muted">&ldquo;{philosophy}&rdquo;</p>
        </div>
      </FadeUp>

    </div>
  );
}
