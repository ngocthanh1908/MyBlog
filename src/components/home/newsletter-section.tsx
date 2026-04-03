import { FadeUp } from "@/components/motion/fade-up";

export function NewsletterSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <FadeUp>
        <div className="bg-primary dark:bg-surface rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-center shadow-2xl border border-transparent dark:border-border">
          {/* Subtle cross/plus background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white dark:text-primary mb-4">
              Get New Posts via Email
            </h2>
            <p className="text-white/70 dark:text-muted mb-8 text-lg">
              Subscribe to receive articles about software engineering, system design, and
              useful learning resources. No spam, I promise!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address..."
                className="flex-grow px-5 py-4 rounded-full bg-white/10 border border-white/20 dark:border-border text-white dark:text-primary placeholder-white/50 dark:placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white/20 transition-all"
              />
              <button
                type="button"
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-bold transition-colors whitespace-nowrap shadow-lg"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
