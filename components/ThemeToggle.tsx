"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full w-10 h-10 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: resolvedTheme === "dark" ? 180 : 0,
          scale: resolvedTheme === "dark" ? 0.8 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-5 w-5 text-zinc-100" />
        ) : (
          <Sun className="h-5 w-5 text-zinc-900" />
        )}
      </motion.div>
    </Button>
  );
}
