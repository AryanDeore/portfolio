"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Always keep navbar visible - sticky to top behavior
    setVisible(true);
  });

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Hamburger Menu Button - Fixed to top left */}
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
          className="fixed top-8 left-8 z-[5001] sm:hidden"
        >
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 bg-background/95 backdrop-blur-sm rounded-full shadow-lg text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Toggle mobile menu"
            data-mobile-menu
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </motion.div>
      </AnimatePresence>

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
            "flex fixed top-5 inset-x-0 mx-auto bg-background/95 backdrop-blur-sm rounded-full shadow-lg z-[5000] px-8 py-0 items-center justify-center space-x-6",
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
                "relative text-muted-foreground items-center flex space-x-1 hover:text-foreground transition-colors duration-200 rounded-md",
                // Responsive padding
                "px-1 py-0", // Mobile: compact padding
                "sm:px-2 sm:py-0" // Desktop: normal padding
              )}
            >
              {navItem.name ? (
                <>
                  <span className="hidden sm:block text-lg">{navItem.name}</span>
                </>
              ) : (
                <span className="block">{navItem.icon}</span>
              )}
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 w-64 bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg z-[4999] sm:hidden"
            data-mobile-menu
          >
            <div className="p-4 space-y-2">
              {navItems
                .filter(item => item.name) // Only show named items in mobile menu
                .map((navItem, idx) => (
                  <Link
                    key={`mobile-link=${idx}`}
                    href={navItem.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      {navItem.icon && <span>{navItem.icon}</span>}
                      <span className="text-lg">{navItem.name}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
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
          className="fixed top-7 left-0 right-0 z-[5000] pointer-events-none"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end rounded-md">
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
