// Theme utility functions

export const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getStoredTheme = () => {
  try {
    return localStorage.getItem('theme');
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return null;
  }
};

export const setStoredTheme = (theme) => {
  try {
    localStorage.setItem('theme', theme);
    return true;
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
    return false;
  }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const createThemeMediaQuery = () => {
  if (typeof window === 'undefined') return null;
  return window.matchMedia('(prefers-color-scheme: dark)');
};

// Debug function to log current theme state
export const debugTheme = () => {
  console.log('Theme Debug Info:', {
    systemTheme: getSystemTheme(),
    storedTheme: getStoredTheme(),
    documentHasDarkClass: document.documentElement.classList.contains('dark'),
    cssVariables: {
      background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
      foreground: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
    }
  });
};
