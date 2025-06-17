import React from "react";
import { useTheme } from "./ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-full text-md"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  );
};
