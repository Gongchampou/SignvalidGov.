import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false
}) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleTheme();
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode (Alt+T)`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode (Alt+T)`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          <Sun className="theme-icon sun-icon" size={14} strokeWidth={2.4} />
          <Moon className="theme-icon moon-icon" size={14} strokeWidth={2.4} />
        </div>
      </div>

      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};
