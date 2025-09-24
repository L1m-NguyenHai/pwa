import React from "react";
import { Moon, Sun, Monitor, Palette, Info } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Sáng", icon: Sun },
    { value: "dark", label: "Tối", icon: Moon },
    { value: "system", label: "Theo hệ thống", icon: Monitor },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Cài đặt
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tùy chỉnh ứng dụng theo sở thích của bạn
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Palette size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Giao diện
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Chọn chế độ hiển thị
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as any)}
                      className={`
                        flex items-center gap-3 p-4 rounded-lg border transition-all duration-200
                        ${
                          theme === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Info size={24} className="text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Thông tin ứng dụng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Phiên bản
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  1.0.0
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Database
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  IndexedDB
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Lưu trữ
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Offline
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  PWA
                </span>
                <span className="font-semibold text-green-600">Hỗ trợ</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Tính năng offline-first
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Dữ liệu của bạn được lưu trữ an toàn trên thiết bị. Ứng dụng hoạt
              động hoàn toàn offline và không yêu cầu kết nối internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
