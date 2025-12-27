"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Tooltip from "@radix-ui/react-tooltip";
import ReactMarkdown from "react-markdown";

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
  onClearChat: () => void;
}

export function GlassChatModal({ isOpen, onClose, messages, onSendMessage, onClearChat }: GlassChatModalProps) {
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
            <p className="text-lg font-medium text-foreground">Ask me about my experience and projects</p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClearChat}
                    className="h-8 w-8 rounded-full hover:bg-background/50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="sr-only">Clear chat history</span>
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    className="z-50 overflow-hidden rounded-md bg-muted border border-border px-3 py-1.5 text-xs text-muted-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    sideOffset={4}
                  >
                    Clear chat history
                    <Tooltip.Arrow className="fill-muted border-t border-l border-border" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-background/50"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>
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
                {message.sender === "assistant" ? (
                  <div className="text-sm leading-relaxed markdown-content">
                    <ReactMarkdown 
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>,
                        li: ({ children }) => <li className="ml-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
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
