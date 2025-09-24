import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/Layout/Layout";
// ...existing code...
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Categories = React.lazy(() => import("./pages/Categories"));
const Budgets = React.lazy(() => import("./pages/Budgets"));
const Settings = React.lazy(() => import("./pages/Settings"));

function App() {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }

    // Handle PWA installation
    let deferredPrompt: any;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;

      // Show install button or prompt
      const installButton = document.createElement("button");
      installButton.textContent = "Cài đặt ứng dụng";
      installButton.className =
        "fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      installButton.onclick = async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          deferredPrompt = null;
          installButton.remove();
        }
      };

      document.body.appendChild(installButton);

      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (installButton.parentNode) {
          installButton.remove();
        }
      }, 10000);
    });
  }, []);

  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Suspense
              fallback={
                <div className="p-8 text-center text-gray-500">Đang tải...</div>
              }
            >
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="budgets" element={<Budgets />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
