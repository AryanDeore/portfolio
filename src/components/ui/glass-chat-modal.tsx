"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Send, Trash2, Copy, Check, Github, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Tooltip from "@radix-ui/react-tooltip";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
      // Get the element at the actual click coordinates (respects z-index stacking)
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      const target = e.target as HTMLElement;
      
      if (!elementAtPoint && !target) return;
      
      // Helper to check if element should be excluded
      const isExcludedElement = (el: HTMLElement | null): boolean => {
        if (!el) return false;
        
        // Check data attributes
        if (
          el.hasAttribute('data-theme-toggle') ||
          el.hasAttribute('data-theme-toggle-container') ||
          el.hasAttribute('data-sticky-nav') ||
          el.hasAttribute('data-mobile-menu')
        ) {
          return true;
        }
        
        // Check if element or any parent has exclusion attributes
        if (
          el.closest('[data-theme-toggle]') !== null ||
          el.closest('[data-theme-toggle-container]') !== null ||
          el.closest('[data-sticky-nav]') !== null ||
          el.closest('[data-mobile-menu]') !== null
        ) {
          return true;
        }
        
        // Check z-index - if element has z-index > 50, it's above the modal
        try {
          const styles = window.getComputedStyle(el);
          const zIndex = styles.zIndex;
          if (zIndex && zIndex !== 'auto' && !isNaN(parseInt(zIndex))) {
            const zIndexNum = parseInt(zIndex, 10);
            if (zIndexNum > 50) {
              return true;
            }
          }
        } catch (err) {
          // Ignore errors
        }
        
        return false;
      };
      
      // Check the element at point first (most accurate)
      if (isExcludedElement(elementAtPoint)) {
        return;
      }
      
      // Also check target
      if (isExcludedElement(target)) {
        return;
      }
      
      // Check event path
      if (e.composedPath) {
        const path = e.composedPath();
        for (const element of path) {
          if (element instanceof HTMLElement && isExcludedElement(element)) {
            return;
          }
        }
      }
      
      // Only close if clicking outside the modal
      if (modalRef.current && !modalRef.current.contains(target)) {
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
        className="relative w-full max-w-[1280px] h-[80vh] bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col overflow-hidden font-[family-name:var(--font-geist-sans)]"
        style={{ width: "min(90vw, 1280px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <p className="text-base font-medium text-foreground">Ask me about my experience and projects</p>
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[680px] mx-auto w-full space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-lg font-semibold text-foreground leading-[1.5]">Ask me anything!</h3>
              <p className="text-base text-muted-foreground max-w-md leading-[1.5]">
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
                    className={`${message.sender === "user" ? "max-w-[70%]" : "max-w-[90%]"} rounded-2xl px-4 py-3 relative ${
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
                      <div className="text-base leading-[1.5] markdown-content prose dark:prose-invert max-w-none">
                        <ReactMarkdown 
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-[1.5]">{children}</p>,
                            ul: ({ children }) => {
                              // Check if all children are link chips - if so, render them in a flex container
                              const childrenArray = Array.isArray(children) ? children : [children];
                              const allAreLinks = childrenArray.every((child: React.ReactNode) => {
                                const reactElement = child as React.ReactElement<{ children?: React.ReactNode }>;
                                const childStr = String(reactElement?.props?.children || child);
                                return childStr.includes('Live:') || childStr.includes('GitHub:') || 
                                       (reactElement?.props?.children && typeof reactElement.props.children === 'object');
                              });
                              
                              if (allAreLinks && childrenArray.length > 0) {
                                return <div className="mb-3 flex flex-wrap gap-2">{children}</div>;
                              }
                              return <ul className="list-disc list-outside mb-3 space-y-1 ml-4">{children}</ul>;
                            },
                            ol: ({ children }) => <ol className="list-decimal list-outside mb-3 space-y-1 ml-4">{children}</ol>,
                            li: ({ children }) => {
                              // Extract text content to check for link patterns
                              const extractText = (node: React.ReactNode): string => {
                                if (typeof node === 'string') return node;
                                if (typeof node === 'number') return String(node);
                                if (Array.isArray(node)) return node.map(extractText).join('');
                                const reactElement = node as React.ReactElement<{ children?: React.ReactNode }>;
                                if (reactElement?.props?.children) return extractText(reactElement.props.children);
                                return '';
                              };
                              
                              const textContent = extractText(children);
                              const hasLinkPattern = textContent.includes('Live:') || textContent.includes('GitHub:');
                              
                              // If it's a link item, render without bullet
                              if (hasLinkPattern) {
                                return <div className="inline-block">{children}</div>;
                              }
                              return <li className="leading-[1.5]">{children}</li>;
                            },
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 leading-[1.5]">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0 leading-[1.5]">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0 leading-[1.5]">{children}</h3>,
                            code: ({ children, className }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="px-1.5 py-0.5 bg-muted rounded text-base font-mono leading-[1.5]">{children}</code>
                              ) : (
                                <code className="block p-3 bg-muted rounded-lg text-base font-mono overflow-x-auto leading-[1.5]">{children}</code>
                              );
                            },
                            pre: ({ children }) => <pre className="mb-3">{children}</pre>,
                            a: ({ href, children }) => {
                              if (!href) return <a>{children}</a>;
                              
                              // Extract text content from children (handles React elements)
                              const extractText = (node: React.ReactNode): string => {
                                if (typeof node === 'string') return node;
                                if (typeof node === 'number') return String(node);
                                if (Array.isArray(node)) return node.map(extractText).join('');
                                const reactElement = node as React.ReactElement<{ children?: React.ReactNode }>;
                                if (reactElement?.props?.children) return extractText(reactElement.props.children);
                                return '';
                              };
                              
                              const linkText = extractText(children);
                              const isGitHub = href.includes('github.com');
                              const isLiveLink = linkText.toLowerCase().includes('live') || 
                                                (!isGitHub && (href.startsWith('http://') || href.startsWith('https://')));
                              
                              // Render as card chip for GitHub and Live links - matching project card button styles
                              if (isGitHub || isLiveLink) {
                                const Icon = isGitHub ? Github : Rocket;
                                // Extract label - remove "Live:" or "GitHub:" prefix if present
                                let label = linkText
                                  .replace(/^(live|github):\s*/i, '')
                                  .trim();
                                
                                // If label is empty or just the URL, use a default
                                if (!label || label === href) {
                                  label = isGitHub ? 'GitHub' : 'Launch';
                                }
                                
                                // GitHub uses enhanced outline variant, Live/Launch uses primary variant
                                const isGitHubStyle = isGitHub;
                                
                                return (
                                  <a 
                                    href={href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={cn(
                                      "group inline-flex items-center justify-center gap-1.5 h-8 px-3 text-xs rounded-md font-medium transition-all duration-200 whitespace-nowrap",
                                      isGitHubStyle
                                        ? "border border-border/60 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm shadow-sm hover:shadow-lg hover:border-primary/50 hover:bg-gradient-to-br hover:from-background hover:to-background/90 hover:scale-[1.02] dark:bg-gradient-to-br dark:from-input/50 dark:to-input/30 dark:border-input/80 dark:hover:border-primary/50 dark:hover:from-input/60 dark:hover:to-input/40"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:scale-[1.02]"
                                    )}
                                  >
                                    <Icon className={cn(
                                      "w-3 h-3 shrink-0 transition-all duration-200",
                                      isGitHubStyle && "text-foreground/80 group-hover:text-primary group-hover:scale-110"
                                    )} />
                                    <span className={cn(
                                      isGitHubStyle && "text-foreground/90 group-hover:text-foreground"
                                    )}>{label}</span>
                                  </a>
                                );
                              }
                              
                              // Regular link styling
                              return (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {children}
                                </a>
                              );
                            },
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-primary/30 pl-4 italic my-3 text-muted-foreground text-base leading-[1.5]">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-base leading-[1.5]">{message.content}</p>
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
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-6 pr-20 md:pr-6">
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
                  className="w-full px-6 py-5 pr-14 text-base leading-[1.5] bg-background/80 backdrop-blur-sm border border-border/70 dark:border-border rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 dark:focus:border-primary/70 transition-all duration-200 placeholder:text-muted-foreground/60 min-h-[62px] max-h-[200px] overflow-y-auto"
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
