// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("SW registered: ", registration);
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateNotification();
            }
          });
        }
      });
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
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});
window.addEventListener("appinstalled", () => {
  console.log("PWA was installed");
  hideInstallButton();
});

function showUpdateNotification() {
  const notification = document.createElement("div");
  notification.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #3B82F6; color: white; padding: 16px; border-radius: 8px; z-index: 1000; max-width: 300px;">
      <p>Có phiên bản mới! Tải lại để cập nhật.</p>
      <button onclick="window.location.reload()" style="background: white; color: #3B82F6; border: none; padding: 8px 16px; border-radius: 4px; margin-top: 8px; cursor: pointer;">Tải lại</button>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 10000);
}
function showInstallButton() {
  const installButton = document.createElement("button");
  installButton.id = "install-button";
  installButton.innerHTML = "📱 Cài đặt ứng dụng";
  installButton.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: #3B82F6; color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); z-index: 1000; transition: transform 0.2s;`;
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
