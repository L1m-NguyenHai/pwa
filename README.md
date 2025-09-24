# 💰 Expense Tracker - Ứng dụng Quản lý Chi tiêu

Ứng dụng Progressive Web App (PWA) hiện đại để quản lý chi tiêu cá nhân với giao diện đẹp mắt và tính năng offline.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)

## ✨ Tính năng chính

### 📊 Dashboard & Analytics
- **Tổng quan tài chính**: Hiển thị thu nhập, chi tiêu và số dư hiện tại
- **Biểu đồ trực quan**: Charts với Recharts để phân tích xu hướng chi tiêu
- **Thống kê theo thời gian**: Xem dữ liệu theo ngày, tuần, tháng
- **Lazy loading**: Tối ưu hiệu suất với React.lazy()

### 💳 Quản lý Giao dịch
- **Thêm/sửa/xóa giao dịch**: Giao diện thân thiện và trực quan
- **Phân loại chi tiêu**: Hỗ trợ nhiều danh mục với icon và màu sắc
- **Tìm kiếm và lọc**: Lọc theo danh mục, ngày tháng, loại giao dịch
- **Date picker**: Component chọn ngày tùy chỉnh

### 🏷️ Danh mục & Ngân sách
- **Quản lý danh mục**: Tạo và tùy chỉnh danh mục thu/chi
- **Thiết lập ngân sách**: Đặt giới hạn chi tiêu cho từng danh mục
- **Theo dõi tiến độ**: Hiển thị phần trăm sử dụng ngân sách
- **Cảnh báo vượt ngân sách**: Thông báo khi sắp vượt hoặc đã vượt giới hạn

### 🌙 Giao diện & Trải nghiệm
- **Dark/Light mode**: Chuyển đổi theme liền mạch
- **Responsive design**: Tương thích mọi thiết bị (mobile-first)
- **PWA features**: Cài đặt như ứng dụng native, hoạt động offline
- **Loading states**: Spinner và skeleton loading cho UX tốt hơn

## 🛠️ Công nghệ sử dụng

### Frontend Core
- **React 18.3.1** - UI Framework với hooks và Suspense
- **TypeScript 5.5.3** - Type safety và developer experience
- **Vite 5.4.2** - Build tool nhanh và hiện đại

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Icon library hiện đại
- **PostCSS + Autoprefixer** - CSS processing

### Routing & State
- **React Router DOM 7.9.1** - Client-side routing
- **React Context API** - State management (Theme, App state)

### Charts & Data Visualization
- **Recharts 3.2.1** - Responsive charts library
- **Date-fns 4.1.0** - Date manipulation utilities

### Database & Storage
- **Dexie 4.2.0** - IndexedDB wrapper for offline storage
- **Supabase 2.57.4** - Backend as a service (optional)

### Development Tools
- **ESLint 9.9.1** - Code linting với React rules
- **PNPM** - Package manager nhanh và tiết kiệm dung lượng

## 🚀 Cài đặt và chạy dự án

### Prerequisites
- Node.js 18+ 
- PNPM (khuyên dùng) hoặc npm/yarn

### Clone repository
```bash
git clone https://github.com/your-username/expense-tracker-pwa.git
cd expense-tracker-pwa
```

### Cài đặt dependencies
```bash
# Với PNPM (khuyên dùng)
pnpm install

# Hoặc với npm
npm install

# Hoặc với yarn
yarn install
```

### Chạy development server
```bash
pnpm dev
# hoặc npm run dev
# hoặc yarn dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build production
```bash
pnpm build
# hoặc npm run build
```

### Preview production build
```bash
pnpm preview
# hoặc npm run preview
```

## 📱 PWA Features

### Service Worker
- **Cache Strategy**: Cache-first cho static assets
- **Background Sync**: Đồng bộ dữ liệu khi có kết nối
- **Offline Support**: Hoạt động mà không cần internet

### Web App Manifest
- **Installable**: Có thể cài như ứng dụng mobile
- **Splash Screen**: Màn hình khởi động tùy chỉnh
- **Theme Colors**: Tích hợp với hệ thống
- **Multiple Icons**: Đầy đủ kích thước icon từ 48px đến 512px

### Installation
1. Mở ứng dụng trong browser (Chrome, Edge, Safari)
2. Nhấn nút "Cài đặt ứng dụng" khi xuất hiện
3. Hoặc dùng menu "Thêm vào màn hình chính"

## 🏗️ Cấu trúc dự án

```
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icons/                # App icons (48px-512px)
├── src/
│   ├── components/
│   │   ├── Charts/           # Chart components với Recharts
│   │   ├── Layout/           # Navigation, Layout
│   │   └── UI/               # Reusable UI components
│   ├── contexts/
│   │   ├── AppContext.tsx    # App state management
│   │   └── ThemeContext.tsx  # Theme switching
│   ├── data/
│   │   ├── database.ts       # Dexie database setup
│   │   ├── dataService.ts    # Data operations
│   │   └── mockData.ts       # Sample data
│   ├── hooks/
│   │   └── useAnalytics.ts   # Custom analytics hook
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Transactions.tsx  # Transaction management
│   │   ├── Categories.tsx    # Category management
│   │   ├── Budgets.tsx       # Budget tracking
│   │   └── Settings.tsx      # App settings
│   ├── types/
│   │   └── index.ts          # TypeScript definitions
│   └── utils/
│       ├── currency.ts       # Currency formatting
│       └── date.ts           # Date utilities
├── package.json
└── README.md
```

## 📊 Database Schema

### Transactions
```typescript
interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: "income" | "expense";
}
```

### Categories
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
}
```

### Budgets
```typescript
interface Budget {
  id: string;
  categoryId: string;
  name: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
}
```

## 🎨 Theme & Customization

### Theme Context
Ứng dụng hỗ trợ dark/light mode với Context API:
- Tự động detect system preference
- Lưu preference vào localStorage
- Smooth transition giữa các theme

### Tailwind Configuration
- Custom colors cho brand identity
- Responsive breakpoints
- Dark mode classes

## 🔧 Scripts có sẵn

```bash
# Development
pnpm dev          # Chạy dev server với hot reload
pnpm build        # Build production
pnpm preview      # Preview production build
pnpm lint         # ESLint checking

# Type checking
tsc --noEmit      # TypeScript type checking
```

## 🚦 Performance Optimizations

### Code Splitting
- React.lazy() cho page components
- Dynamic imports cho heavy libraries
- Separate chunks cho vendor libraries

### Bundle Analysis
```bash
pnpm build
# Kiểm tra dist/ folder để xem bundle size
```

### PWA Performance
- Service Worker caching
- Preload critical resources
- Lazy loading images với LazyImage component

## 🧪 Testing

### ESLint Configuration
- React hooks rules
- TypeScript recommended rules
- Custom rules cho code quality

### Recommended Testing Setup
```bash
# Thêm testing libraries
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

## 📋 Roadmap & Todo

### Version 2.0 Features
- [ ] **Authentication**: Login với Google/Facebook
- [ ] **Cloud Sync**: Đồng bộ dữ liệu cross-device
- [ ] **Export Data**: PDF/CSV export
- [ ] **Recurring Transactions**: Giao dịch định kỳ
- [ ] **Multi-language**: i18n support
- [ ] **Advanced Analytics**: More detailed reports
- [ ] **Receipt Scanner**: OCR cho hóa đơn
- [ ] **Family Sharing**: Chia sẻ budget với gia đình

### Technical Improvements
- [ ] Unit tests với Vitest
- [ ] E2E tests với Playwright
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Error boundary implementation

## 🤝 Đóng góp

### Development Guidelines
1. **Fork** repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style
- Sử dụng ESLint rules có sẵn
- TypeScript strict mode
- Functional components với hooks
- Consistent naming conventions

### Commit Messages
```
feat: add new feature
fix: bug fix
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Project Link**: [https://github.com/your-username/expense-tracker-pwa](https://github.com/your-username/expense-tracker-pwa)
- **Demo**: [https://your-demo-link.vercel.app](https://your-demo-link.vercel.app)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Recharts](https://recharts.org/) - Charts library
- [Dexie](https://dexie.org/) - IndexedDB wrapper

---

⭐ **Nếu dự án này hữu ích, hãy cho một star để ủng hộ nhé!** ⭐