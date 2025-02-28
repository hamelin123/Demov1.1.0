'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext({
  theme: 'light' as Theme,
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.classList[initialTheme === 'dark' ? 'add' : 'remove']('dark');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList[newTheme === 'dark' ? 'add' : 'remove']('dark');
  };

  return mounted ? (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  ) : <>{children}</>;
}