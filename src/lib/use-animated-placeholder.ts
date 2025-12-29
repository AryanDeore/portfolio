"use client";

import { useState, useEffect, useRef } from "react";

const sharedPrefix = "Ask me about my ";
const suffixes = ["projects", "skills", "experience"];

interface UseAnimatedPlaceholderOptions {
  isActive: boolean; // Whether animation should run
}

export function useAnimatedPlaceholder({ isActive }: UseAnimatedPlaceholderOptions) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef({ 
    currentSuffixIndex: 0, 
    isDeleting: false,
    prefixLength: 0,
    suffixText: ""
  });

  // Cursor blinking effect
  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  // Main animation logic
  useEffect(() => {
    if (!isActive) {
      // Clear any pending timeouts when inactive
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const typingSpeed = 90;
    const deletingSpeed = 55; // Average of 50-60ms
    const pauseDuration = 1050; // Average of 900-1200ms

    const tick = () => {
      const state = stateRef.current;
      const currentSuffix = suffixes[state.currentSuffixIndex];

      if (state.prefixLength < sharedPrefix.length) {
        // Typing the shared prefix
        const nextPrefixLength = state.prefixLength + 1;
        stateRef.current.prefixLength = nextPrefixLength;
        setDisplayText(sharedPrefix.substring(0, nextPrefixLength));
        timeoutRef.current = setTimeout(tick, typingSpeed);
      } else if (state.isDeleting) {
        // Backspacing only the suffix
        if (state.suffixText.length > 0) {
          const nextSuffix = state.suffixText.slice(0, -1);
          stateRef.current.suffixText = nextSuffix;
          setDisplayText(sharedPrefix + nextSuffix);
          timeoutRef.current = setTimeout(tick, deletingSpeed);
        } else {
          // Finished deleting suffix, move to next suffix
          const nextIndex = (state.currentSuffixIndex + 1) % suffixes.length;
          stateRef.current = { 
            currentSuffixIndex: nextIndex, 
            isDeleting: false,
            prefixLength: sharedPrefix.length,
            suffixText: ""
          };
          setDisplayText(sharedPrefix);
          timeoutRef.current = setTimeout(tick, typingSpeed);
        }
      } else {
        // Typing the suffix
        if (state.suffixText.length < currentSuffix.length) {
          const nextSuffix = currentSuffix.substring(0, state.suffixText.length + 1);
          stateRef.current.suffixText = nextSuffix;
          setDisplayText(sharedPrefix + nextSuffix);
          timeoutRef.current = setTimeout(tick, typingSpeed);
        } else {
          // Finished typing suffix, pause then start deleting
          timeoutRef.current = setTimeout(() => {
            stateRef.current.isDeleting = true;
            timeoutRef.current = setTimeout(tick, deletingSpeed);
          }, pauseDuration);
        }
      }
    };

    // Start animation
    tick();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isActive]);

  return {
    text: displayText,
    showCursor,
  };
}

