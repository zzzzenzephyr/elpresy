"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themeTransitionCss = `
  ::view-transition-group(root) {
    animation-duration: 1s;
    animation-timing-function: var(--expo-out);
  }
        
  ::view-transition-new(root) {
    animation-name: reveal-light-theme;
    filter: blur(2px);
  }

  ::view-transition-old(root),
  .dark::view-transition-old(root) {
    animation: none;
    z-index: -1;
  }
  .dark::view-transition-new(root) {
    animation-name: reveal-dark-theme;
    filter: blur(2px);
  }

  @keyframes reveal-dark-theme {
    from {
      clip-path: circle(0% at 100% 0%);
      filter: blur(8px);
    }
    50% { filter: blur(4px); }
    to {
      clip-path: circle(150% at 100% 0%);
      filter: blur(0px);
    }
  }

  @keyframes reveal-light-theme {
    from {
       clip-path: circle(0% at 100% 0%);
       filter: blur(8px);
    }
    50% { filter: blur(4px); }
    to {
      clip-path: circle(150% at 100% 0%);
      filter: blur(0px);
    }
  }
`;

export const useThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const styleId = "theme-transition-styles";

  const updateStyles = useCallback(() => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = themeTransitionCss;
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
    updateStyles();

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [theme, setTheme, updateStyles, isDark]);

  return {
    isDark,
    toggleTheme,
  };
};

export const ThemeToggleButton = ({
  className = "",
}: {
  className?: string;
}) => {
  const { isDark, toggleTheme } = useThemeToggle();

  return (
    <button
      type="button"
      className={cn(
        "size-8 flex items-center justify-center cursor-pointer rounded-full bg-transparent p-0 transition-all duration-300 active:scale-95 text-body hover:text-heading",
        className,
      )}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill="currentColor"
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="transparent"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};
