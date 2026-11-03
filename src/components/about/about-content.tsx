import { bio, timeline } from "@/data/about-data";

/** "Về tôi" content: intro paragraphs and personal timeline. Rendered as the home page. */
export function AboutContent() {
  return (
    <div className="bg-surface border border-border rounded-[20px] p-10 mb-12 shadow-[var(--card-shadow)]">
      <h1 className="font-serif text-[2.2rem] font-medium mb-5">Về Phạm Ngọc Thanh</h1>

      {bio.map((paragraph, i) => (
        <p key={i} className="text-muted text-[1.05rem] mb-[18px] leading-relaxed">
          {i === 0 ? (
            <>
              Tôi là một{" "}
              <strong className="text-primary">Senior SAP Basis Specialist & Technology Consultant</strong>{" "}
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
      <h2 className="font-serif text-[1.6rem] mt-9 mb-5">Hành trình cá nhân</h2>
      <div className="border-l-2 border-accent-light pl-6 flex flex-col gap-7 ml-1">
        {timeline.map((item) => (
          <div key={item.title} className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-accent border-[3px] border-surface" />
            <span className="text-[0.83rem] text-accent font-bold mb-1 inline-block">{item.period}</span>
            <h3 className="text-[1.1rem] font-bold mb-1">{item.title}</h3>
            <p className="text-[0.95rem] text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
