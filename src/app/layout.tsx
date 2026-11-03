import type { Metadata } from "next";
import { Work_Sans, Inconsolata } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { AdminBar } from "@/components/layout/admin-bar";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { siteConfig } from "@/lib/site-config";
import { personJsonLd, websiteJsonLd } from "@/lib/structured-data";
import "@/styles/globals.css";

// Work Sans (body + headings) and Inconsolata (code), matching the reference design
const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  style: ["normal", "italic"],
});

const inconsolata = Inconsolata({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: siteConfig.name,
    images: [{ url: "/og", width: 1200, height: 630, alt: "Phạm Ngọc Thanh" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body
        className={`${workSans.variable} ${inconsolata.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <MotionProvider>
            <ReadingProgress />
            {/* Desktop: sticky sidebar + content column. Mobile: top bar above content. */}
            <div className="mx-auto max-w-[90rem] lg:grid lg:grid-cols-[13rem_1fr] lg:gap-6">
              <Navbar />
              <div className="min-w-0 lg:pt-8">
                <AdminBar />
                <main className="min-h-screen pt-0">{children}</main>
                <Footer />
              </div>
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
