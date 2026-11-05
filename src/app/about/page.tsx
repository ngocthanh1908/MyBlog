import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "Về tôi",
  description: "Senior SAP Basis Specialist & Technology Consultant tại TP. Hồ Chí Minh.",
  openGraph: {
    images: [
      {
        url: "/og?title=Phạm+Ngọc+Thanh&description=Senior+SAP+Basis+Specialist",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="site-container animate-slide-up">
      <AboutContent />
    </div>
  );
}
