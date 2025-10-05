"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit?: (message: string) => void;
  placeholder?: string;
}

const suggestionChips = [
  "Do you know PyTorch?",
  "Are you familiar with LLMs?",
  "Any LLM fine-tuning exp?",
];

export function ChatInput({ onSubmit, placeholder = "Ask me anything about my work..." }: ChatInputProps) {
  const [message, setMessage] = useState("");

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
            placeholder={placeholder}
            className="w-full px-6 py-4 pr-14 text-base bg-background/80 backdrop-blur-sm border border-border/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 placeholder:text-muted-foreground/60"
          />
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

      {/* Suggestion Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {suggestionChips.map((chip, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleChipClick(chip)}
            className="rounded-full bg-background/60 backdrop-blur-sm border-border/40 hover:bg-background/80 hover:border-border/60 transition-all duration-200 text-sm"
          >
            {chip}
          </Button>
        ))}
      </div>
    </div>
  );
}
