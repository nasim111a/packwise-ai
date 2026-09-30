import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    try {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('packwise-theme', 'light');
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }
  }, []);

  const setTheme = (_newTheme: Theme) => {
    // Theme is permanently light
  };

  const toggleTheme = () => {
    // Theme is permanently light
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: 'light',
        setTheme,
        toggleTheme,
        isDark: false,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
