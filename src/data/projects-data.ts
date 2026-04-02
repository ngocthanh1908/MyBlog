import { z } from "zod";

// Zod schema for a project entry
export const ProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  links: z.object({
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    blog: z.string().optional(),
  }),
  featured: z.boolean(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const projects: Project[] = [
  {
    title: "SAP Integration Hub",
    description:
      "A centralised integration platform that connects SAP S/4HANA with third-party services via REST and SOAP APIs, providing real-time data synchronisation and error handling workflows.",
    techStack: ["SAP", "TypeScript", "Node.js"],
    links: {},
    featured: true,
  },
  {
    title: "AI Document Processor",
    description:
      "AI-powered document extraction pipeline that parses unstructured PDFs and images, extracts key-value data using OpenAI vision models, and delivers structured JSON output via a FastAPI service.",
    techStack: ["Python", "OpenAI", "FastAPI"],
    links: {},
    featured: false,
  },
  {
    title: "Personal Blog",
    description:
      "This blog — built with Next.js 15, React 19, Tailwind CSS 4, and MDX. Features a bento-grid homepage, dark-mode, animated transitions, and server-rendered blog posts.",
    techStack: ["Next.js", "React", "Tailwind CSS", "MDX"],
    links: {
      github: "https://github.com/phamngocthanh/myblog",
    },
    featured: false,
  },
];
