import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  
  // Check local storage first
  const storedTheme = localStorage.getItem('shopwep-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  
  // Fall back to system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return systemPrefersDark ? 'dark' : 'light';
};

const applyThemeClass = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set) => {
  // Apply the theme on startup
  const initialTheme = getInitialTheme();
  applyThemeClass(initialTheme);

  // Set up dynamic OS listener
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const storedTheme = localStorage.getItem('shopwep-theme');
      // Only sync with OS if user hasn't explicitly set a preference
      if (!storedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyThemeClass(newTheme);
        set({ theme: newTheme });
      }
    });
  }

  return {
    theme: initialTheme,
    toggleTheme: () => set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('shopwep-theme', nextTheme);
      applyThemeClass(nextTheme);
      return { theme: nextTheme };
    }),
    setTheme: (theme) => {
      localStorage.setItem('shopwep-theme', theme);
      applyThemeClass(theme);
      set({ theme });
    }
  };
});
