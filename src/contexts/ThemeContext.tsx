import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('expense-tracker-theme') as Theme;
    return savedTheme || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      let darkMode = false;
      
      if (theme === 'dark') {
        darkMode = true;
      } else if (theme === 'light') {
        darkMode = false;
      } else {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(darkMode);
      document.documentElement.classList.toggle('dark', darkMode);
      localStorage.setItem('expense-tracker-theme', theme);
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};