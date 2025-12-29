"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { useAnimatedPlaceholder } from "@/lib/use-animated-placeholder";
import { HeroPill } from "@/components/ui/hero-pill";

interface ChatInputProps {
  onSubmit?: (message: string) => void;
  placeholder?: string;
  hidePills?: boolean;
}

const suggestionChips = [
  "Do you know PyTorch?",
  "Are you familiar with LLMs?",
  "Any LLM fine-tuning experience?",
];

export function ChatInput({ onSubmit, placeholder, hidePills = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationStopped, setAnimationStopped] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Animated placeholder - only active when idle, not focused, no message, and not stopped
  const shouldAnimatePlaceholder = !placeholder && !isFocused && !message && !animationStopped;
  const animatedPlaceholder = useAnimatedPlaceholder({
    isActive: shouldAnimatePlaceholder,
  });
  const displayPlaceholder = placeholder || "";

  // Marquee animation effect
  useEffect(() => {
    const animate = () => {
      if (!marqueeRef.current || isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const container = marqueeRef.current;
      const contentWidth = container.scrollWidth / 2; // Divide by 2 since we duplicate content

      // Move position
      positionRef.current -= 0.5; // Adjust speed here (lower = slower)

      // Reset position when first set is completely off screen
      if (Math.abs(positionRef.current) >= contentWidth) {
        positionRef.current = 0;
      }

      container.style.transform = `translateX(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  // Page-load attention nudge (one-time animation)
  useEffect(() => {
    if (hasAnimated || !textareaRef.current) return;
    
    // Check for reduced motion preference (client-side only)
    const prefersReducedMotion = typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
    
    if (!prefersReducedMotion) {
      const textarea = textareaRef.current;
      textarea.classList.add('chat-input-attention-nudge');
      setHasAnimated(true);
      
      // Remove animation class after animation completes
      const timeout = setTimeout(() => {
        textarea.classList.remove('chat-input-attention-nudge');
      }, 4600);
      
      return () => clearTimeout(timeout);
    } else {
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSubmit) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && onSubmit) {
        onSubmit(message.trim());
        setMessage("");
      }
    }
  };

  const handleChipClick = (chipText: string) => {
    setMessage(chipText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-start">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // Stop animation when user types
              if (e.target.value.length > 0) {
                setAnimationStopped(true);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              // Stop animation when user focuses
              setAnimationStopped(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={displayPlaceholder}
            rows={1}
            style={{ resize: 'none' }}
            className="chat-input w-full px-6 py-5 pr-14 text-base bg-background/80 backdrop-blur-sm border border-primary/45 dark:border-primary/35 rounded-3xl focus:outline-none focus:border-primary/70 dark:focus:border-primary/80 hover:border-primary/65 dark:hover:border-primary/55 transition-all duration-[200ms] placeholder:text-muted-foreground/60 min-h-[62px] max-h-[200px] overflow-y-scroll"
          />
          
          {/* Animated placeholder text with cursor overlay */}
          {shouldAnimatePlaceholder && (
            <div className="absolute left-6 top-5 pointer-events-none text-base text-muted-foreground/60 flex items-center">
              <span>{animatedPlaceholder.text}</span>
              <span 
                className={`ml-0.5 w-0.5 h-5 bg-muted-foreground/60 transition-opacity duration-100 ${
                  animatedPlaceholder.showCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          )}
          <button
            type="submit"
            className="absolute right-3 top-4 p-2 disabled:opacity-50 transition-opacity"
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5 text-primary hover:text-primary/80 transition-colors rotate-45" />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>

      {/* Suggestion Pills */}
      {!hidePills && (
        <div className="relative overflow-hidden w-full">
          <div 
            ref={marqueeRef}
            className="flex whitespace-nowrap will-change-transform"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* First set of pills */}
            {suggestionChips.map((chip, index) => (
              <div key={`hero-pill-1-${index}`} onClick={() => handleChipClick(chip)} className="cursor-pointer flex-shrink-0 mr-4">
                <HeroPill
                  text={chip}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
            {/* Second identical set for seamless loop */}
            {suggestionChips.map((chip, index) => (
              <div key={`hero-pill-2-${index}`} onClick={() => handleChipClick(chip)} className="cursor-pointer flex-shrink-0 mr-4">
                <HeroPill
                  text={chip}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
          {/* Gradient fade-out effects */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
        </div>
      )}
    </div>
  );
}
