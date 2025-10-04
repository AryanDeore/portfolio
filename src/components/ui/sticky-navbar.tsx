"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";

export const StickyNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactElement;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const { theme, toggleTheme } = useTheme();

  const [visible, setVisible] = useState(true); // Always start visible

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Always keep navbar visible - sticky to top behavior
    setVisible(true);
  });

  return (
    <>
      {/* Main Navigation */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "flex fixed top-8 inset-x-0 mx-auto bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg z-[5000] px-8 py-5 items-center justify-center space-x-6",
            // Ensure navbar doesn't stretch too wide on ultra-wide screens - use max-w-fit for content-based width with a reasonable maximum
            "max-w-fit",
            className
          )}
        >
          {navItems.map((navItem, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative text-muted-foreground items-center flex space-x-1 hover:text-foreground transition-colors duration-200"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Theme Toggle - Inside max-width container, aligned right */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="fixed top-10 left-0 right-0 z-[5000] pointer-events-none"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end bg-red-500/30 border-2 border-red-500">
            <div className="pointer-events-auto">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-background/20 transition-colors duration-200 text-muted-foreground hover:text-foreground"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
