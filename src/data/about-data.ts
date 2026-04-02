/** Static data for the About page */

export interface ExpertiseArea {
  iconName: "Database" | "Brain" | "Code";
  title: string;
  description: string;
}

export interface Interest {
  title: string;
  description: string;
}

/** Two-paragraph bio */
export const bio: string[] = [
  "I'm a Senior SAP Consultant and AI-Enabled Architect with over a decade of experience helping enterprises modernise their core systems. My work centres on S/4HANA transformations, system integration, and embedding AI into business processes to drive measurable outcomes.",
  "Outside the office I chase marathon finish lines — training by heart rate under the MAF method — and explore mindfulness as a tool for clarity and sustained performance. I believe the same principles that make a great long-distance runner make a great technologist: consistency, patience, and iterative improvement.",
];

/** Three core expertise domains */
export const expertiseAreas: ExpertiseArea[] = [
  {
    iconName: "Database",
    title: "SAP Solutions",
    description:
      "End-to-end SAP consulting across S/4HANA migrations, Fiori UX, and enterprise integrations. Translating complex business requirements into robust, scalable SAP architectures.",
  },
  {
    iconName: "Brain",
    title: "AI & Architecture",
    description:
      "Designing AI-enabled solutions that augment enterprise workflows — from LLM integration to cloud-native system design and event-driven architectures.",
  },
  {
    iconName: "Code",
    title: "Software Engineering",
    description:
      "Full-stack development with modern web technologies, TypeScript, and DevOps practices. Building developer tooling and internal platforms that accelerate teams.",
  },
];

/** Personal interests */
export const interests: Interest[] = [
  {
    title: "Marathon Running",
    description:
      "Competing in road marathons using aerobic-base MAF training. Currently chasing a sub-3:30 finish.",
  },
  {
    title: "Mindfulness",
    description:
      "Daily meditation and intentional focus practices — stillness as a performance multiplier.",
  },
  {
    title: "Technology",
    description:
      "Exploring open-source projects, emerging AI frameworks, and the intersection of software craft and human productivity.",
  },
];
