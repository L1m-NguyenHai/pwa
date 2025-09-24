import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Receipt,
  PieChart,
  Target,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface NavigationProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const { isDark } = useTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ' },
    { path: '/transactions', icon: Receipt, label: 'Giao dịch' },
    { path: '/categories', icon: PieChart, label: 'Danh mục' },
    { path: '/budgets', icon: Target, label: 'Ngân sách' },
    { path: '/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const NavItem: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <NavLink
        to={item.path}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
          ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }
        `}
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        <Icon size={20} />
        <span className="font-medium">{item.label}</span>
      </NavLink>
    );
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Expense Tracker
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map(item => (
                <NavItem key={item.path} item={item} />
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-30">
          <div className="flex">
            {navItems.slice(0, 4).map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-colors duration-200
                    ${isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-500'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-30
      transform transition-all duration-300 ease-in-out
      ${sidebarOpen ? 'w-64' : 'w-16'}
    `}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <PieChart size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Expense Tracker
            </h1>
          )}
        </div>
        
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full mb-6 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Menu size={20} className={`mx-auto ${sidebarOpen ? 'transform rotate-90' : ''} transition-transform duration-200`} />
        </button>

        <nav className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;