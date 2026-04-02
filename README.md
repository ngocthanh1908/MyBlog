# Pham Ngoc Thanh — Personal Blog

A personal blog and portfolio built with Next.js 15, featuring MDX-powered articles, dark mode, and OG image generation.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, standalone output) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Content | MDX via next-mdx-remote, gray-matter |
| Testing | Vitest, @testing-library/react |

## Prerequisites

- Node.js 20+
- npm

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run test` | Run test suite |
| `npm run lint` | Lint source files |

## Docker

```bash
docker build -t myblog .
docker run -p 3000:3000 myblog
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Site base URL for SEO and OG images |

Create a `.env.local` file at the project root to override defaults.

## Project Structure

```
src/
├── app/          # Next.js App Router pages and layouts
├── components/   # Reusable React components
├── content/      # MDX blog posts and static content
├── data/         # Static data (navigation, metadata, etc.)
├── lib/          # Utility functions and helpers
└── styles/       # Global CSS and Tailwind configuration
```

## License

MIT
