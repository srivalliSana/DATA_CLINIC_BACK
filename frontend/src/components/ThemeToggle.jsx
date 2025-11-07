import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className={`w-12 h-6 flex items-center rounded-full transition-colors duration-300 focus:outline-none ${
        isDark ? "bg-blue-500" : "bg-blue-400"
      }`}
      aria-label="Toggle theme"
    >
      <span
        className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md transform transition-transform duration-300 ${
          isDark ? "translate-x-6 bg-blue-700" : "translate-x-0 bg-blue-500"
        }`}
      >
        {isDark ? (
          <FaMoon className="text-white" />
        ) : (
          <FaSun className="text-yellow-100" />
        )}
      </span>
    </button>
  );
}