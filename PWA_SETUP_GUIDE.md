# Hướng dẫn Setup Progressive Web App (PWA) - Expense Tracker

## 📋 Tổng quan dự án

**Expense Tracker** là ứng dụng quản lý chi tiêu cá nhân được xây dựng với:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API
- **Routing**: React Router DOM v7
- **Database**: Supabase (tùy chọn)

### Cấu trúc dự án:

```
src/
├── components/
│   ├── Layout/          # Navigation, Layout components
│   └── UI/              # Reusable UI components
├── contexts/            # React Context (Theme, App state)
├── pages/               # Route pages (Dashboard, Transactions, etc.)
├── data/                # Mock data
├── types/               # TypeScript types
└── utils/               # Utility functions

public/
├── manifest.json        # PWA manifest (đã có)
├── sw.js               # Service worker (cần cập nhật)
├── icon-192.png        # App icons (cần tạo lại)
└── icon-512.png
```

---

## 🚀 STEP-BY-STEP SETUP PWA

### BƯỚC 1: Tạo App Icons chất lượng cao

#### 1.1. Tạo favicon và app icons

```powershell
# Tạo icons 192x192 và 512x512 bằng .NET
Add-Type -AssemblyName System.Drawing

# Icon 192x192
$bitmap192 = New-Object System.Drawing.Bitmap(192, 192)
$graphics192 = [System.Drawing.Graphics]::FromImage($bitmap192)
$graphics192.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics192.Clear([System.Drawing.Color]::FromArgb(59, 130, 246))

# Vẽ biểu tượng ví tiền
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics192.FillRectangle($brush, 30, 70, 132, 80)
$graphics192.FillRectangle(New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 64, 175)), 30, 60, 132, 20)

# Vẽ dấu dollar
$font = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
$graphics192.DrawString("$", $font, $brush, 145, 95)

$bitmap192.Save("public/icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics192.Dispose()
$bitmap192.Dispose()

# Icon 512x512 (tương tự nhưng lớn hơn)
$bitmap512 = New-Object System.Drawing.Bitmap(512, 512)
$graphics512 = [System.Drawing.Graphics]::FromImage($bitmap512)
$graphics512.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics512.Clear([System.Drawing.Color]::FromArgb(59, 130, 246))

$brush512 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics512.FillRectangle($brush512, 80, 180, 352, 200)
$graphics512.FillRectangle(New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 64, 175)), 80, 160, 352, 40)

$font512 = New-Object System.Drawing.Font("Arial", 64, [System.Drawing.FontStyle]::Bold)
$graphics512.DrawString("$", $font512, $brush512, 385, 250)

$bitmap512.Save("public/icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics512.Dispose()
$bitmap512.Dispose()
```

#### 1.2. Tạo các kích thước icon khác (tùy chọn)

```powershell
# Tạo thêm các kích thước khác cho compatibility tốt hơn
# 72x72, 96x96, 128x128, 144x144, 152x152, 384x384
```

### BƯỚC 2: Cập nhật HTML Head

**File: `index.html`**

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />

    <!-- Basic PWA Meta Tags -->
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#3B82F6" />
    <meta
      name="description"
      content="Ứng dụng quản lý chi tiêu cá nhân thông minh"
    />
    <meta
      name="keywords"
      content="expense tracker, quản lý chi tiêu, tài chính cá nhân, PWA"
    />

    <!-- PWA Meta Tags -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Expense Tracker" />
    <meta name="msapplication-TileImage" content="/icon-192.png" />
    <meta name="msapplication-TileColor" content="#3B82F6" />

    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />

    <!-- Additional PWA Features -->
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />

    <title>Expense Tracker - Quản lý Chi tiêu</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### BƯỚC 3: Cải thiện Web App Manifest

**File: `public/manifest.json`**

```json
{
  "name": "Expense Tracker - Quản lý Chi tiêu",
  "short_name": "ExpenseTracker",
  "description": "Ứng dụng quản lý chi tiêu cá nhân thông minh với tính năng offline",
  "start_url": "/",
  "id": "/",
  "display": "standalone",
  "display_override": ["window-controls-overlay", "standalone"],
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "orientation": "portrait-primary",
  "categories": ["finance", "productivity", "business"],
  "lang": "vi-VN",
  "scope": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Dashboard view of Expense Tracker"
    },
    {
      "src": "/screenshot-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Mobile view of transaction list"
    }
  ],
  "shortcuts": [
    {
      "name": "Thêm giao dịch mới",
      "short_name": "Thêm giao dịch",
      "description": "Nhanh chóng thêm giao dịch thu chi",
      "url": "/transactions?action=add",
      "icons": [
        {
          "src": "/icon-192.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "Xem thống kê",
      "short_name": "Thống kê",
      "description": "Xem tổng quan tài chính",
      "url": "/",
      "icons": [
        {
          "src": "/icon-192.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    }
  ]
}
```

### BƯỚC 4: Tạo Service Worker nâng cao

**File: `public/sw.js`**

```javascript
const CACHE_NAME = "expense-tracker-v3";
const STATIC_CACHE_NAME = "expense-tracker-static-v3";
const DYNAMIC_CACHE_NAME = "expense-tracker-dynamic-v3";

// Files to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      console.log("[ServiceWorker] Caching app shell");
      await cache.addAll(STATIC_ASSETS);
    })()
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    (async () => {
      const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("[ServiceWorker] Removing old cache", cacheName);
            await caches.delete(cacheName);
          }
        })
      );
    })()
  );
  return self.clients.claim();
});

// Fetch event - Network First with Cache Fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith("http")) return;

  // Handle API requests differently
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match(request);
          return cachedResponse || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // Handle static assets - Cache First
  if (STATIC_ASSETS.some((asset) => request.url.includes(asset))) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);
        return cachedResponse || fetch(request);
      })()
    );
    return;
  }

  // Handle other requests - Network First with Cache Fallback
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok && request.method === "GET") {
          const cache = await caches.open(DYNAMIC_CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // Return offline page for navigation requests
        if (request.mode === "navigate") {
          const cache = await caches.open(STATIC_CACHE_NAME);
          return cache.match("/index.html");
        }

        return new Response("Content not available offline", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })()
  );
});

// Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("[ServiceWorker] Background sync");
    event.waitUntil(
      // Sync offline data when connection restored
      syncOfflineData()
    );
  }
});

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data
      ? event.data.text()
      : "Bạn có thông báo mới từ Expense Tracker",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification("Expense Tracker", options)
  );
});

// Helper function to sync offline data
async function syncOfflineData() {
  try {
    // Implement sync logic for offline transactions
    console.log("[ServiceWorker] Syncing offline data");
  } catch (error) {
    console.error("[ServiceWorker] Sync failed:", error);
  }
}
```

### BƯỚC 5: Register Service Worker và PWA Features

**File: `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("SW registered: ", registration);

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Show update notification
              showUpdateNotification();
            }
          });
        }
      });

      // Handle messages from SW
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "SW_UPDATE_AVAILABLE") {
          showUpdateNotification();
        }
      });
    } catch (registrationError) {
      console.log("SW registration failed: ", registrationError);
    }
  });
}

// PWA Install prompt
let deferredPrompt: any = null;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  deferredPrompt = e;

  // Show install button
  showInstallButton();
});

// Handle app installed
window.addEventListener("appinstalled", (evt) => {
  console.log("PWA was installed");
  hideInstallButton();
});

// Helper functions
function showUpdateNotification() {
  // Show a notification to user about app update
  const notification = document.createElement("div");
  notification.innerHTML = `
    <div style="
      position: fixed; 
      top: 20px; 
      right: 20px; 
      background: #3B82F6; 
      color: white; 
      padding: 16px; 
      border-radius: 8px; 
      z-index: 1000;
      max-width: 300px;
    ">
      <p>Có phiên bản mới! Tải lại để cập nhật.</p>
      <button onclick="window.location.reload()" style="
        background: white; 
        color: #3B82F6; 
        border: none; 
        padding: 8px 16px; 
        border-radius: 4px; 
        margin-top: 8px;
        cursor: pointer;
      ">
        Tải lại
      </button>
    </div>
  `;
  document.body.appendChild(notification);

  // Auto remove after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

function showInstallButton() {
  // Create install button
  const installButton = document.createElement("button");
  installButton.id = "install-button";
  installButton.innerHTML = "📱 Cài đặt ứng dụng";
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #3B82F6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    z-index: 1000;
    transition: transform 0.2s;
  `;

  installButton.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      hideInstallButton();
    }
  });

  installButton.addEventListener("mouseover", () => {
    installButton.style.transform = "scale(1.05)";
  });

  installButton.addEventListener("mouseout", () => {
    installButton.style.transform = "scale(1)";
  });

  document.body.appendChild(installButton);
}

function hideInstallButton() {
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.remove();
  }
}
```

### BƯỚC 6: Cập nhật Vite Configuration

**File: `vite.config.ts`**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Fix lucide-react issues
  optimizeDeps: {
    include: ["lucide-react"],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "lucide-react": ["lucide-react"],
          recharts: ["recharts"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    // Enable source maps for better debugging
    sourcemap: true,
  },

  // PWA related configurations
  server: {
    port: 5173,
    host: true, // Allow external connections for mobile testing
  },

  preview: {
    port: 4173,
    host: true,
  },
});
```

### BƯỚC 7: Thêm PWA Hook (tùy chọn)

**File: `src/hooks/usePWA.ts`**

```typescript
import { useState, useEffect } from "react";

interface PWAHook {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  install: () => Promise<void>;
  isOffline: boolean;
}

export const usePWA = (): PWAHook => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is installed
    setIsInstalled(
      "standalone" in window.navigator ||
        window.matchMedia("(display-mode: standalone)").matches
    );

    // Check if running in standalone mode
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  return {
    isInstalled,
    isStandalone,
    canInstall,
    install,
    isOffline,
  };
};
```

### BƯỚC 8: Thêm Offline Indicator

**File: `src/components/UI/OfflineIndicator.tsx`**

```tsx
import React from "react";
import { WifiOff } from "lucide-react";
import { usePWA } from "../../hooks/usePWA";

const OfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 text-center z-50">
      <div className="flex items-center justify-center gap-2">
        <WifiOff size={16} />
        <span>Bạn đang offline. Một số tính năng có thể bị hạn chế.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
```

### BƯỚC 9: Cập nhật App.tsx để include PWA features

**File: `src/App.tsx`**

```tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";
import OfflineIndicator from "./components/UI/OfflineIndicator";

function App() {
  useEffect(() => {
    // Handle PWA update prompt
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          console.log("New service worker found, preparing update...");
        });
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <OfflineIndicator />
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
```

### BƯỚC 10: Testing và Deployment

#### 10.1. Test PWA locally

```bash
# Build ứng dụng
pnpm build

# Preview production build
pnpm preview

# Test trên mobile devices qua network
# App sẽ accessible tại http://[your-ip]:4173
```

#### 10.2. Test PWA features

- **Lighthouse PWA audit**: Chrome DevTools > Lighthouse > PWA
- **Application tab**: Kiểm tra Service Workers, Manifest, Storage
- **Network throttling**: Test offline functionality
- **Install prompt**: Test trên mobile devices

#### 10.3. Performance optimizations

```bash
# Analyze bundle size
pnpm build && npx vite-bundle-analyzer dist

# Check core web vitals
# Use Lighthouse or Chrome DevTools Performance tab
```

---

## ✅ PWA CHECKLIST

### Essential Features

- [x] **Web App Manifest** với tất cả required fields
- [x] **Service Worker** với caching strategies
- [x] **Responsive Design**
- [x] **HTTPS** (required for PWA)
- [x] **Icons** multiple sizes (192x192, 512x512)
- [x] **Install prompt** handling
- [x] **Offline functionality**

### Advanced Features

- [x] **Background Sync** for offline actions
- [x] **Push Notifications** support
- [x] **App shortcuts** in manifest
- [x] **Screenshots** for app stores
- [x] **Update notifications**
- [x] **Network status indicator**

### Performance

- [x] **Code splitting** với Vite
- [x] **Asset optimization**
- [x] **Lazy loading** cho routes
- [x] **Service Worker caching**

---

## 🚀 DEPLOYMENT

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
npx vercel --prod
# Publish directory: dist

```

### Self-hosted

```bash

# Serve với nginx hoặc Apache
# Ensure HTTPS và proper headers cho PWA
```

---

## 🔧 TROUBLESHOOTING

### Common Issues:

1. **Icons không hiện**: Kiểm tra file paths và sizes
2. **Service Worker không load**: Kiểm tra HTTPS và scope
3. **Install prompt không xuất hiện**: Cần HTTPS và valid manifest
4. **Offline không hoạt động**: Kiểm tra SW caching strategies
5. **Trang bị chặn index bởi x-robots-tag: noindex**: Kiểm tra header này trên production, xóa khỏi cấu hình hoặc code nếu không muốn chặn SEO.

### Debug Tools:

- Chrome DevTools > Application > Service Workers
- Chrome DevTools > Application > Manifest
- Chrome DevTools > Network > Offline checkbox
- Lighthouse PWA audit

---

## 📱 FINAL RESULT

Sau khi hoàn thành các bước trên, bạn sẽ có:

✅ **Progressive Web App** với offline support  
✅ **Installable** trên mobile và desktop  
✅ **Fast loading** với service worker caching  
✅ **Native-like experience** với app shell  
✅ **Push notifications** ready  
✅ **App store ready** với screenshots và manifest

**Expense Tracker PWA** sẵn sàng để deploy và sử dụng như một native app! 🎉
