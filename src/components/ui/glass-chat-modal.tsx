"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Tooltip from "@radix-ui/react-tooltip";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

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
  isLoading?: boolean;
}

export function GlassChatModal({ isOpen, onClose, messages, onSendMessage, onClearChat, isLoading }: GlassChatModalProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

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
                    <Trash2 className="h-4 w-4" />
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
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-xl font-semibold text-foreground">Ask me anything!</h3>
              <p className="text-muted-foreground max-w-md">
                I can tell you about my projects, experience, skills, and more.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {["Tell me about your projects", "What's your experience?", "What technologies do you know?"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSendMessage(suggestion)}
                    className="px-4 py-2 text-sm bg-muted/50 hover:bg-muted border border-border/30 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} group items-start gap-3`}
                >
                  {message.sender === "assistant" && message.content && (
                    <Avatar className="h-8 w-8 shrink-0 mt-1">
                      <AvatarImage src="/website-icon.svg" alt="Aryan" className="rotate-90" />
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 relative ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {message.sender === "assistant" && message.content && (
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-background border border-border rounded-full hover:bg-muted"
                        aria-label="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                    
                    {message.sender === "assistant" ? (
                      <div className="text-lg leading-normal markdown-content prose prose-lg dark:prose-invert max-w-none">
                        <ReactMarkdown 
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-outside mb-3 space-y-1 ml-4">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-outside mb-3 space-y-1 ml-4">{children}</ol>,
                            li: ({ children }) => <li className="leading-normal">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-3 first:mt-0">{children}</h3>,
                            code: ({ children, className }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="px-1.5 py-0.5 bg-muted rounded text-base font-mono">{children}</code>
                              ) : (
                                <code className="block p-3 bg-muted rounded-lg text-base font-mono overflow-x-auto">{children}</code>
                              );
                            },
                            pre: ({ children }) => <pre className="mb-3">{children}</pre>,
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {children}
                              </a>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-primary/30 pl-4 italic my-3 text-muted-foreground">
                                {children}
                              </blockquote>
                            ),
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
              
              {/* Typing indicator - only show if loading and last message is not an assistant with content */}
              {isLoading && (messages.length === 0 || messages[messages.length - 1]?.sender !== "assistant" || !messages[messages.length - 1]?.content) && (
                <div className="flex justify-start items-start gap-3">
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <AvatarImage src="/website-icon.svg" alt="Aryan" className="rotate-90" />
                  </Avatar>
                  <div className="rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
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
