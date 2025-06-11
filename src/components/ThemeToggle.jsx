import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ variant = 'default', size = 'default' }) => {
  const { theme, toggleTheme, isLoading } = useTheme();

  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    default: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  };

  // Style variants
  const variantClasses = {
    default: 'bg-background border border-border hover:bg-accent text-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (isLoading) {
    return (
      <div className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-md flex items-center justify-center
        animate-pulse
      `}>
        <div className={`${iconSizeClasses[size]} bg-muted rounded`} />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-md flex items-center justify-center
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        hover:scale-105 active:scale-95
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className={`${iconSizeClasses[size]} transition-transform duration-200`} />
      ) : (
        <Sun className={`${iconSizeClasses[size]} transition-transform duration-200`} />
      )}
    </button>
  );
};

export default ThemeToggle;
