/** Static data for the About page — Vietnamese content */

export interface TimelineEntry {
  period: string;
  title: string;
  description: string;
}

/** Two-paragraph bio */
export const bio: string[] = [
  "Tôi là một Senior SAP Basis Specialist & Technology Consultant có hơn 20 năm kinh nghiệm trong ngành IT, làm việc tại Thành phố Hồ Chí Minh. Tôi đam mê việc kiến tạo sự ổn định cho các hạ tầng CNTT quy mô lớn và không ngừng cập nhật các công nghệ tiên tiến như AI Agent, Next.js hay BTP Services.",
  "Song song với sự nghiệp công nghệ, tôi sở hữu chứng chỉ quốc tế PMP (Project Management Professional) và coi thể thao bền bỉ là kim chỉ nam cho tư duy quản trị cuộc sống.",
];

/** Career timeline */
export const timeline: TimelineEntry[] = [
  {
    period: "2024 — Hiện tại",
    title: "SAP Basis Consultant & AI Vibe Coder",
    description:
      "Vận hành hạ tầng doanh nghiệp và phát triển các giải pháp phần mềm thông minh cá nhân hóa.",
  },
  {
    period: "Chứng chỉ PMP",
    title: "Quản lý dự án quốc tế",
    description:
      "Áp dụng tư duy quản trị chuẩn mực vào quy trình triển khai và bảo trì hệ thống công nghệ.",
  },
  {
    period: "Thành viên Ban quản trị",
    title: "MAF Running Ho Chi Minh",
    description:
      "Lan tỏa thói quen chạy bộ khoa học, lành mạnh đến cộng đồng chạy đường dài.",
  },
];
