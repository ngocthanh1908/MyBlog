import type { Metadata } from "next";
import { bio, timeline } from "@/data/about-data";

export const metadata: Metadata = {
  title: "Về tôi",
  description:
    "Senior SAP Basis Specialist & Technology Consultant tại TP. Hồ Chí Minh.",
  openGraph: {
    images: [
      {
        url: "/og?title=Về+tôi&description=Senior+SAP+Basis+Specialist",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-[820px] mx-auto px-6 animate-slide-up">
      <div className="bg-surface border border-border rounded-[20px] p-10 mb-12 shadow-[var(--card-shadow)]">
        <h2 className="font-serif text-[2.2rem] font-medium mb-5">
          Về Phạm Ngọc Thanh
        </h2>

        {bio.map((paragraph, i) => (
          <p key={i} className="text-muted text-[1.05rem] mb-[18px] leading-relaxed">
            {i === 0 ? (
              <>
                Tôi là một{" "}
                <strong className="text-primary">
                  Senior SAP Basis Specialist & Technology Consultant
                </strong>{" "}
                {paragraph.split("Technology Consultant")[1]}
              </>
            ) : (
              <>
                {paragraph.split("PMP")[0]}
                <strong className="text-primary">PMP (Project Management Professional)</strong>
                {paragraph.split("PMP (Project Management Professional)")[1]}
              </>
            )}
          </p>
        ))}

        {/* Timeline */}
        <h3 className="font-serif text-[1.6rem] mt-9 mb-5">Hành trình cá nhân</h3>
        <div className="border-l-2 border-accent-light pl-6 flex flex-col gap-7 ml-1">
          {timeline.map((item) => (
            <div key={item.title} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-accent border-[3px] border-surface" />
              <span className="text-[0.83rem] text-accent font-bold mb-1 inline-block">
                {item.period}
              </span>
              <h4 className="text-[1.1rem] font-bold mb-1">{item.title}</h4>
              <p className="text-[0.95rem] text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
