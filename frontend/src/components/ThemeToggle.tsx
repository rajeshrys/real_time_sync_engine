import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle = ({ className = "", showLabel = false }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${className}`}
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`h-4 w-4 transform transition-all duration-300 absolute inset-0 ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-amber-400"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`h-4 w-4 transform transition-all duration-300 absolute inset-0 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 text-slate-700"
          }`}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
