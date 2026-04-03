import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { siteConfig } from "@/lib/site-config";
import { personJsonLd } from "@/lib/structured-data";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    images: [{ url: "/og", width: 1200, height: 630, alt: "Pham Ngoc Thanh" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <MotionProvider>
            <Navbar />
            <main className="min-h-screen pt-0">{children}</main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
