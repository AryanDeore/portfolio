"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Shuffle } from "lucide-react";
import { useAnimatedPlaceholder } from "@/lib/use-animated-placeholder";
import { HeroPill } from "@/components/ui/hero-pill";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ChatInputProps {
  onSubmit?: (message: string) => void;
  placeholder?: string;
  hidePills?: boolean;
}

const allQuestions = [
  "Why did you build an AI that lets people interview your resume",
  "What are your strongest technical skills",
  "How do you combine data engineering and machine learning",
  "Can you explain the architecture of your RAG system",
  "Why did you need schema-aware parent-child chunking",
  "How does your retrieval pipeline work end to end",
  "How do you monitor and evaluate LLM performance",
  "How is this project deployed in production",
  "How do you ensure answers stay grounded in real data",
];

// Default set of questions that display nicely in two rows
const defaultQuestions = [
  "What are your strongest technical skills",
  "Can you explain the architecture of your RAG system",
  "How does your retrieval pipeline work end to end",
  "How do you monitor and evaluate LLM performance",
];

// Function to randomly select 4 questions from the full list
function getRandomQuestions(questions: string[], count: number = 4): string[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function ChatInput({ onSubmit, placeholder, hidePills = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationStopped, setAnimationStopped] = useState(false);
  const [clickedPillIndex, setClickedPillIndex] = useState<number | null>(null);
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>(defaultQuestions);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Animated placeholder - only active when idle, not focused, no message, and not stopped
  const shouldAnimatePlaceholder = !placeholder && !isFocused && !message && !animationStopped;
  const animatedPlaceholder = useAnimatedPlaceholder({
    isActive: shouldAnimatePlaceholder,
  });
  const displayPlaceholder = placeholder || "";


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
    // Submit on Enter (without Shift) or Cmd/Ctrl+Enter
    const isEnter = e.key === 'Enter';
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;
    
    if (isEnter && (!e.shiftKey || isCmdOrCtrl)) {
      e.preventDefault();
      if (message.trim() && onSubmit) {
        onSubmit(message.trim());
        setMessage("");
      }
    }
  };

  const handleChipClick = (chipText: string, index: number) => {
    setClickedPillIndex(index);
    setMessage(chipText);
    // Focus the textarea so user can immediately press Enter/Cmd+Enter
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
    // Reset clicked state after animation
    setTimeout(() => {
      setClickedPillIndex(null);
    }, 200);
  };

  const handleShuffle = () => {
    setDisplayedQuestions(getRandomQuestions(allQuestions, 4));
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
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto px-4">
            {displayedQuestions.map((chip, index) => (
              <div 
                key={`hero-pill-${chip}-${index}`} 
                onClick={() => handleChipClick(chip, index)} 
                className="cursor-pointer"
              >
                <HeroPill
                  text={chip}
                  isPressed={clickedPillIndex === index}
                  className="!mb-0 hover:scale-105"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={handleShuffle}
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-md hover:bg-accent/50"
                    aria-label="Shuffle questions"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    className="z-50 px-2 py-1 text-xs text-muted-foreground bg-transparent animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    sideOffset={8}
                  >
                    Shuffle questions
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
      )}
    </div>
  );
}
