"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTypingAnimationOptions {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function useTypingAnimation({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: UseTypingAnimationOptions) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const tick = useCallback(() => {
    const fullText = texts[currentTextIndex];

    if (isPaused) {
      return;
    }

    if (isDeleting) {
      setCurrentText((prev) => prev.substring(0, prev.length - 1));
    } else {
      setCurrentText((prev) => fullText.substring(0, prev.length + 1));
    }

    // Check if we've finished typing the current text
    if (!isDeleting && currentText === fullText) {
      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
    }

    // Check if we've finished deleting the current text
    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    isPaused,
    texts,
    pauseDuration,
  ]);

  useEffect(() => {
    if (texts.length === 0) return;

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);

    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed, texts.length]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530); // Blink every 530ms for a natural cursor feel

    return () => clearInterval(cursorTimer);
  }, []);

  return {
    text: currentText,
    showCursor,
  };
}
