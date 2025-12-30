"use client";

import { MessageCircle } from "lucide-react";
import { useChatModal } from "@/components/chat-context";
import { useChat } from "@/lib/use-chat";
import { cn } from "@/lib/utils";

export function ChatButton() {
  const { openChatModal, isChatModalOpen } = useChatModal();
  const { messages } = useChat();
  
  const hasMessages = messages.length > 0;

  // Hide button when modal is open
  if (isChatModalOpen) return null;

  return (
    <button
      onClick={openChatModal}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "h-13 w-13 rounded-full",
        "bg-primary/40 text-primary-foreground/80",
        "backdrop-blur-sm",
        "shadow-sm hover:shadow-md",
        "transition-all duration-200",
        "hover:bg-primary/90 hover:text-primary-foreground hover:scale-110 active:scale-95",
        "flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "group",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
      
      {/* Badge indicator if there are messages */}
      {hasMessages && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-foreground flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-primary" />
        </span>
      )}
    </button>
  );
}

