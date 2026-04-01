System Instructions: Personal Brand Website (Tailscale Style)
1. Project Vision
Xây dựng một nền tảng thương hiệu cá nhân tích hợp: Portfolio công nghệ (Web Apps), Blog chia sẻ (Chạy bộ, Mindfulness, AI) và Dấu ấn cá nhân (Senior SAP Consultant). Thiết kế mô phỏng sự tinh tế, hiệu năng cao và sạch sẽ của Tailscale.

2. Visual Identity & Design Tokens
Theme: Minimalist Tech-Professional.

Color Palette:

Primary: #000000 (Main text, primary buttons).

Accent: #312E81 (Indigo - Gợi nhớ sự tin cậy của doanh nghiệp và SAP).

Background: #FFFFFF (White) kết hợp với các dải nền phụ #F3F4F6 (Gray 100) để phân tách bento grid.

Border: #E5E7EB (Gray 200) cho các khối trong grid.

Typography:

Font chính: Inter hoặc Geist (Cảm giác hiện đại, tech-heavy).

Headline: Chữ đậm (Extra Bold), tracking hẹp, cỡ chữ lớn.

Radius: 12px - 16px cho các card và button.

3. Page Structure (The Bento Layout)
A. Navigation Bar (Sticky)
Trái: Logo chữ ký (ví dụ: "Thanh.dev" hoặc "PNT").

Giữa: Menu (Blog, Projects, About, Habits).

Phải: Nút "Contact" hoặc Link đến GitHub/LinkedIn.

B. Hero Section (The "Value Prop")
Main Heading: Một câu khẳng định kết hợp giữa IT và Đời sống (Ví dụ: "Engineering SAP Systems & Running Marathons").

Sub-heading: Giới thiệu ngắn về 20 năm kinh nghiệm IT và hành trình trở thành AI-Enabled SAP Architect.

Call to Action: "Explore Projects" & "Read Blog".

C. Personal Dashboard Grid (Bento Style)
Sử dụng CSS Grid để tạo các khối không đều nhau:

Khối 1 (Large): Featured Web App (Hình ảnh demo + link + tech stack).

Khối 2 (Medium): "Latest Run" - Tích hợp stats chạy bộ (Số km, nhịp tim MAF) hoặc trích dẫn cảm hứng.

Khối 3 (Small): AI Agent Spotlight (Các project AI mini đang phát triển).

Khối 4 (Medium): Blog Preview (Tiêu đề bài viết mới nhất về cảm nhận cuộc sống).

D. Writing / Blog Section
Danh sách các bài viết với thiết kế tối giản: Title, Date, và một tag nhỏ (e.g., #Mindfulness, #SAP, #Running).

Hiệu ứng hover: Nền card chuyển sang xám nhạt hoặc hiện border indigo.

E. Project Showcase (Web Apps)
Các card dự án hiển thị dưới dạng "Product Cards" của Tailscale.

Mỗi card có icon ứng dụng, mô tả ngắn và một nút "Open App".

4. Technical Stack
Framework: Next.js (App Router) cho hiệu năng SEO tốt nhất.

Styling: Tailwind CSS.

Animation: Framer Motion (hiệu ứng "fade-up" khi cuộn trang).

Content: MDX (để viết blog bằng Markdown dễ dàng).

Icons: Lucide React (Sạch sẽ, đồng bộ).

5. Coding Principles for Claude Code
Clean Code: Ưu tiên functional components và sơ đồ thư mục rõ ràng (/components, /lib, /content).

Responsive: Grid phải tự động chuyển thành 1 cột trên Mobile.

Typography First: Tập trung vào khoảng cách dòng (line-height) và phân cấp tiêu đề để tạo sự sang trọng.

Micro-interactions: Thêm hiệu ứng hover nhẹ vào các khối bento để tăng trải nghiệm người dùng.

6. Implementation Roadmap
Step 1: Setup Next.js với Tailwind và cấu hình font Geist/Inter.

Step 2: Tạo layout chính với Navbar và Footer theo style tối giản.

Step 3: Xây dựng hệ thống Bento Grid ở trang chủ.

Step 4: Cài đặt bộ lọc blog (Categories) và trang chi tiết bài viết sử dụng MDX.

Step 5: Tối ưu hóa SEO cho thương hiệu cá nhân "Phạm Ngọc Thanh".