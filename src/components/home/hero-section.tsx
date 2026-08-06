export function HeroSection() {
  return (
    <section className="mb-11 bg-surface p-9 rounded-[20px] border border-border shadow-[var(--card-shadow)] relative overflow-hidden">
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />

      {/* Status badge */}
      <div className="inline-flex items-center gap-2.5 bg-accent-light border border-accent-border text-accent px-3.5 py-1.5 rounded-[20px] text-[0.82rem] font-bold mb-5">
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse-dot" />
        Đang vận hành S/4HANA & Luyện tập Marathon 2026
      </div>

      <h2 className="font-serif text-[2.4rem] font-medium leading-[1.25] mb-4 tracking-tight">
        Nơi lưu giữ những dòng suy nghĩ{" "}
        <span className="italic text-accent font-semibold">mộc mạc</span>{" "}
        về công nghệ, nhịp đập bước chạy và trải nghiệm sống.
      </h2>

      <p className="text-muted text-[1.05rem] max-w-[680px]">
        Góc nhỏ cá nhân tại TP. Hồ Chí Minh — ghi chép lại những trải nghiệm thực chiến
        từ quản trị hệ thống doanh nghiệp, thói quen lập trình AI và kỷ luật đường dài.
      </p>
    </section>
  );
}
