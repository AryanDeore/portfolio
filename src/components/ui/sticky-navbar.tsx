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
import { ThemeToggleButton } from "@/components/ui/shadcn-io/theme-toggle-button";
import { useTheme } from "@/components/theme-provider";

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
            "flex max-w-fit fixed top-10 inset-x-0 mx-auto bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg z-[5000] px-8 py-4 items-center justify-center space-x-6",
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

      {/* Theme Toggle - Fixed to the right */}
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
          className="fixed top-10 right-6 z-[5000]"
        >
          <ThemeToggleButton
            theme={theme}
            onClick={toggleTheme}
            variant="none"
            className="bg-background/95 backdrop-blur-sm border border-border shadow-lg"
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};
