import type { Metadata } from "next";
import {
  runStats,
  runDashboardTitle,
  runDashboardSubtitle,
  yearlyRunGoal,
  mafTitle,
  mafContent,
} from "@/data/habits-data";

export const metadata: Metadata = {
  title: "Chạy bộ",
  description:
    "Cung đường chạy và sức bền kiên trì — nhật ký luyện tập MAF Running.",
  openGraph: {
    images: [
      {
        url: "/og?title=Chạy+bộ&description=Nhật+ký+luyện+tập+MAF+Running",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function HabitsPage() {
  return (
    <div className="max-w-[820px] mx-auto px-6 animate-slide-up">
      {/* Hero */}
      <section className="mb-11 bg-surface p-9 rounded-[20px] border border-border shadow-[var(--card-shadow)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
        <h2 className="font-serif text-[2.2rem] font-medium leading-[1.25] mb-4">
          Cung đường chạy &{" "}
          <span className="italic text-accent font-semibold">sức bền</span> kiên trì
        </h2>
        <p className="text-muted text-[1.05rem]">
          Chạy bộ với tôi là nhịp cầu cân bằng sau những giờ làm việc kỹ thuật căng thẳng.
          Giữ nhịp tim ở vùng hiếu khí (MAF) giúp tích lũy nội lực bền bỉ.
        </p>
      </section>

      {/* Running Dashboard */}
      <div className="bg-surface border border-border rounded-[20px] p-8 mb-10 shadow-[var(--card-shadow)]">
        <h3 className="font-serif text-[1.6rem] mb-2">{runDashboardTitle}</h3>
        <p className="text-muted text-[0.92rem]">{runDashboardSubtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {runStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-background border border-border p-5 rounded-[14px] text-center"
            >
              <div className="font-serif text-[2.2rem] font-bold text-accent leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-[0.82rem] text-muted font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Running Goal */}
      <div className="bg-surface border border-border rounded-[20px] p-8 mb-10 shadow-[var(--card-shadow)]">
        <h3 className="font-serif text-[1.6rem] mb-5">{yearlyRunGoal.label}</h3>
        <div className="bg-background border border-border rounded-xl p-[18px]">
          <div className="flex justify-between font-bold text-[0.9rem] mb-2.5">
            <span>Muc tieu tich luy nam {yearlyRunGoal.year}</span>
            <span className="text-accent">
              {yearlyRunGoal.currentKm} / {yearlyRunGoal.targetKm} KM
            </span>
          </div>
          <div className="h-2.5 bg-border rounded-[5px] overflow-hidden">
            <div
              className="h-full rounded-[5px] transition-all duration-500"
              style={{
                width: `${Math.min(100, (yearlyRunGoal.currentKm / yearlyRunGoal.targetKm) * 100)}%`,
                background: "linear-gradient(90deg, var(--accent), #52c291)",
              }}
            />
          </div>
        </div>
      </div>

      {/* MAF Philosophy */}
      <div className="bg-surface border border-border rounded-[20px] p-10 mb-12 shadow-[var(--card-shadow)]">
        <h2 className="font-serif text-[2.2rem] font-medium mb-5">{mafTitle}</h2>
        {mafContent.map((paragraph, i) => (
          <p key={i} className="text-muted text-[1.05rem] mb-[18px] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
