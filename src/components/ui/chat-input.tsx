"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useTypingAnimation } from "@/lib/use-typing-animation";
import { HeroPill } from "@/components/ui/hero-pill";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSubmit?: (message: string) => void;
  placeholder?: string;
}

const suggestionChips = [
  "Do you know PyTorch?",
  "Are you familiar with LLMs?",
  "Any LLM fine-tuning experience?",
];

const typingQuestions = [
  "Do you know PyTorch?",
  "Are you familiar with ChatGPT-style LLM APIs?",
  "Have you fine-tuned LLMs?",
  "Have you created a RAG?",
];

export function ChatInput({ onSubmit, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const typingAnimation = useTypingAnimation({
    texts: typingQuestions,
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseDuration: 1500,
  });

  // Use typing animation if no custom placeholder is provided and input is not focused
  const shouldShowTypingAnimation = !placeholder && !isFocused && !message;
  const displayPlaceholder = placeholder || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && onSubmit) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleChipClick = (chipText: string) => {
    setMessage(chipText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={displayPlaceholder}
            className="w-full px-6 py-4 pr-14 text-base bg-background/80 backdrop-blur-sm border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 placeholder:text-muted-foreground/60"
          />
          
          {/* Animated typing text with cursor overlay */}
          {shouldShowTypingAnimation && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-base text-muted-foreground/60 flex items-center">
              <span>{typingAnimation.text}</span>
              <span 
                className={`ml-0.5 w-0.5 h-5 bg-muted-foreground/60 transition-opacity duration-100 ${
                  typingAnimation.showCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          )}
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 h-10 w-10 rounded-full p-0 bg-primary hover:bg-primary/90 disabled:opacity-50"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>

      {/* Suggestion Pills */}
      <div className="relative overflow-hidden w-full">
        <div className="flex animate-marquee hover:pause-marquee gap-4 whitespace-nowrap">
          {/* Duplicate the pills for seamless loop */}
          {[...suggestionChips, ...suggestionChips].map((chip, index) => (
            <div key={`hero-pill-${index}`} onClick={() => handleChipClick(chip)} className="cursor-pointer flex-shrink-0">
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
    </div>
  );
}
