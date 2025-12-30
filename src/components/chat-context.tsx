"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { ChatInputRef } from "@/components/ui/chat-input";

interface ChatContextType {
  openChatModal: () => void;
  closeChatModal: () => void;
  isChatModalOpen: boolean;
  focusHeroInput: () => void;
  registerHeroInputRef: (ref: React.RefObject<ChatInputRef>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const heroInputRef = useRef<React.RefObject<ChatInputRef> | null>(null);

  const openChatModal = useCallback(() => {
    setIsChatModalOpen(true);
  }, []);

  const closeChatModal = useCallback(() => {
    setIsChatModalOpen(false);
  }, []);

  const registerHeroInputRef = useCallback((ref: React.RefObject<ChatInputRef>) => {
    heroInputRef.current = ref;
  }, []);

  const focusHeroInput = useCallback(() => {
    if (heroInputRef.current?.current) {
      const chatInput = heroInputRef.current.current;
      // Find the hero input container and scroll to it smoothly
      const heroInputContainer = document.querySelector('[data-hero-input]');
      if (heroInputContainer) {
        heroInputContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus and select the input after a short delay to ensure scroll completes
        setTimeout(() => {
          chatInput.focus();
          chatInput.select();
        }, 300);
      } else {
        // Fallback: scroll to top and focus/select
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          chatInput.focus();
          chatInput.select();
        }, 300);
      }
    }
  }, []);

  return (
    <ChatContext.Provider value={{ openChatModal, closeChatModal, isChatModalOpen, focusHeroInput, registerHeroInputRef }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatModal() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatModal must be used within a ChatProvider");
  }
  return context;
}

