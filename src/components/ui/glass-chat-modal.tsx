"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface GlassChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function GlassChatModal({ isOpen, onClose, messages, onSendMessage }: GlassChatModalProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      
      // Focus the textarea when modal opens
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    onSendMessage(currentMessage.trim());
    setCurrentMessage("");
    
    // Focus back to textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[1280px] h-[80vh] bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col overflow-hidden"
        style={{ width: "min(90vw, 1280px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-xl font-semibold">Chat with Aryan</h2>
            <p className="text-sm text-muted-foreground">Ask me about my experience and projects</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-background/50"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 backdrop-blur-sm border border-border/30"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-6">
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-start">
                <textarea
                  ref={textareaRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  style={{ resize: 'none' }}
                  className="w-full px-6 py-5 pr-14 text-base bg-background/80 backdrop-blur-sm border border-border/70 dark:border-border rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 dark:focus:border-primary/70 transition-all duration-200 placeholder:text-muted-foreground/60 min-h-[62px] max-h-[200px] overflow-y-auto"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-4 p-2 disabled:opacity-50 transition-opacity"
                  disabled={!currentMessage.trim()}
                >
                  <Send className="h-5 w-5 text-primary hover:text-primary/80 transition-colors rotate-45" />
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
