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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header */}
      <FadeUp>
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <Activity size={14} className="text-accent" />
            <span className="text-xs font-medium text-muted">Tracking Progress</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-[1.1] mb-4">
            Running &amp; Habits
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Tracking progress one kilometre at a time.
          </p>
        </div>
      </FadeUp>

      <div className="max-w-3xl space-y-10">
        {/* Latest Run */}
        <FadeUp delay={0.1}>
          <div className="bg-surface rounded-3xl border border-border p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Latest Run</h2>
              <span className="text-sm text-muted bg-accent/10 px-3 py-1 rounded-full">{latestRun.date}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-extrabold text-accent">{latestRun.distance}</p>
                <p className="text-xs text-muted mt-1">Distance</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">{latestRun.pace}</p>
                <p className="text-xs text-muted mt-1">Pace</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary">{latestRun.avgHR}</p>
                <p className="text-xs text-muted mt-1">Avg HR (bpm)</p>
              </div>
            </div>
            <p className="mt-6 text-sm italic text-muted border-t border-border/50 pt-4">{latestRun.notes}</p>
          </div>
        </FadeUp>

        {/* Weekly Summary */}
        <FadeUp delay={0.15}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">Weekly Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <StatCard value={weeklyStats.totalDistance} label="Total Distance" icon={<MapPin size={16} />} />
            <StatCard value={String(weeklyStats.totalRuns)} label="Runs This Week" icon={<Activity size={16} />} />
            <StatCard value={weeklyStats.avgPace} label="Avg Pace" icon={<Timer size={16} />} />
          </div>
        </FadeUp>

        {/* Personal Records */}
        <FadeUp delay={0.2}>
          <div className="bg-surface rounded-3xl border border-border p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg font-bold mb-4">Personal Records</h2>
            <PersonalRecordsTable records={personalRecords} />
          </div>
        </FadeUp>

        {/* Current Goals */}
        <FadeUp delay={0.25}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">Current Goals</h2>
          <div className="space-y-3">
            {currentGoals.map((item) => (
              <div
                key={item.goal}
                className="bg-surface rounded-2xl border border-border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 p-1.5 rounded-lg">
                    <Target size={16} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{item.goal}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm">
                      <span className="text-muted">
                        Target: <span className="font-semibold text-primary">{item.target}</span>
                      </span>
                      <span className="text-muted">
                        Now: <span className="font-semibold text-accent">{item.current}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Philosophy */}
        <FadeUp delay={0.3}>
          <div className="bg-surface rounded-3xl border border-border p-8 flex items-start gap-4">
            <div className="bg-accent/10 p-2 rounded-xl">
              <Heart size={18} className="text-accent" />
            </div>
            <p className="text-muted italic leading-relaxed">&ldquo;{philosophy}&rdquo;</p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
