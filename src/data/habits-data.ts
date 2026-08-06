// Habits page data — running stats (Vietnamese)

export interface RunStat {
  value: string;
  label: string;
}

export const runStats: RunStat[] = [
  { value: "42.2 KM", label: "Cần Giờ Full Marathon" },
  { value: "180 - Tuổi", label: "Công thức nhịp tim MAF" },
  { value: "5 KM", label: "Thói quen chạy mỗi ngày" },
];

export const runDashboardTitle = "Nhật ký Strava / Thống kê cá nhân";
export const runDashboardSubtitle =
  "Cập nhật thực tế từ hoạt động luyện tập với MAF Running Ho Chi Minh.";

export const mafTitle = "Phương pháp MAF & Tinh thần kỷ luật";
export const mafContent: string[] = [
  "MAF (Maximum Aerobic Function) là phương pháp tập luyện tập trung vào việc phát triển hệ năng lượng hiếu khí. Bằng cách giữ nhịp tim dưới ngưỡng cho phép, cơ thể học cách sử dụng mỡ làm năng lượng chính, giảm thiểu nguy cơ chấn thương.",
  "Tinh thần này cũng giống hệt như vận hành hệ thống SAP Basis: Duy trì tải ở mức an toàn, tối ưu hóa tài nguyên cốt lõi để đảm bảo hệ thống chạy liên tục không mệt mỏi.",
];
