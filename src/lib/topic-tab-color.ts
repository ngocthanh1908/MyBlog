export type TabColor = { background: string; color: string };

const DARK_TEXT = "#1f2021";

/** Well-known topics keep a stable brand-like colour. Keys are lower-case. */
const KNOWN: Record<string, TabColor> = {
  css: { background: "#bac8ff", color: "#364fc7" },
  javascript: { background: "#ffe066", color: "#50514f" },
  typescript: { background: "#3178c6", color: "#ffffff" },
  html: { background: "#fcc2d7", color: "#a61e4d" },
  vue: { background: "#b2f2bb", color: "#2b8a3e" },
  react: { background: "#a5d8ff", color: "#1864ab" },
  git: { background: "#ffffff", color: "#da4b34" },
};

/** Pastel palette for every other topic, picked deterministically from the name. */
const PASTELS = ["#bac8ff", "#ffe066", "#fcc2d7", "#b2f2bb", "#a5d8ff", "#ffd8a8", "#d0bfff", "#96f2d7"];

/** "Tất cả" and other neutral blocks use no fill (page background + dark outline). */
const NEUTRAL: TabColor = { background: "var(--color-bg)", color: "var(--color-pr)" };

function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h;
}

/** Tab colours for a topic label; `neutral` forces the unfilled style. */
export function getTopicTabColor(topic: string, neutral = false): TabColor {
  if (neutral) return NEUTRAL;
  const known = KNOWN[topic.trim().toLowerCase()];
  if (known) return known;
  return { background: PASTELS[hash(topic.toLowerCase()) % PASTELS.length], color: DARK_TEXT };
}
