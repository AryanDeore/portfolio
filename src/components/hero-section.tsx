"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ChatInput } from "@/components/ui/chat-input";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { GlassChatModal } from "@/components/ui/glass-chat-modal";
import { useChat } from "@/lib/use-chat";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export function HeroSection() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showStickyInput, setShowStickyInput] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const heroInputRef = useRef<HTMLDivElement>(null);
  
  const { messages: chatMessages, isLoading, send, reset } = useChat();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Hide scroll indicator after scrolling 50px
      setShowScrollIndicator(scrollY < 50);
      
      // Calculate when hero input completely exits behind navbar
      if (heroInputRef.current) {
        const heroInputRect = heroInputRef.current.getBoundingClientRect();
        const navbarTop = 32; // top-8 = 32px from top
        
        // Show sticky input when bottom of hero input crosses top of navbar
        // This means the hero input has completely exited the visible area
        const heroInputBottom = heroInputRect.bottom;
        
        setShowStickyInput(heroInputBottom <= navbarTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChatSubmit = async (message: string) => {
    if (chatMessages.length === 0) {
      setIsChatModalOpen(true);
    }
    await send(message);
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
  };

  const handleClearChat = () => {
    reset();
  };
  
  // Convert useChat messages to Message format for the modal
  const messages: Message[] = chatMessages.map((msg, idx) => ({
    id: `${msg.role}-${idx}`,
    content: msg.content,
    sender: msg.role,
    timestamp: new Date(),
  }));

  const scrollToNextSection = () => {
    const heroHeight = window.innerHeight;
    window.scrollTo({
      top: heroHeight,
      behavior: "smooth"
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Content */}
      <MaxWidthWrapper maxWidth="4xl" className="relative z-10 text-center">
        <div className="space-y-8">
          {/* Greeting */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-5xl font-bold tracking-tight">
              Hi, I&apos;m Aryan
            </h1>
            
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-2xl text-muted-foreground font-medium">
              AI Engineer
            </h2>
            
            {/* Tagline
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Building LLM-powered tools with LangChain, PyTorch, and fine-tuned LLMs.
            </p> */}
          </div>

          {/* Chat Input */}
          <div ref={heroInputRef} className="pt-8">
            <ChatInput onSubmit={handleChatSubmit} />
          </div>
        </div>

      </MaxWidthWrapper>
      
      {/* Scroll Indicator - Fixed at bottom of screen */}
      {showScrollIndicator && (
        <button
          onClick={scrollToNextSection}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300 hover:scale-125 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full p-3 hover:bg-background/10 backdrop-blur-sm"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground/60 animate-bounce hover:text-foreground transition-all duration-300 hover:drop-shadow-lg" />
        </button>
      )}

      {/* Sticky Chat Input - Fixed at bottom when scrolled */}
      <div className={`fixed bottom-4 left-4 right-4 z-30 transition-all duration-300 ease-in-out transform ${
        showStickyInput ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}>
        <MaxWidthWrapper maxWidth="2xl">
          <ChatInput onSubmit={handleChatSubmit} placeholder="Ask me anything..." hidePills={true} />
        </MaxWidthWrapper>
      </div>

      {/* Glass Chat Modal */}
      <GlassChatModal
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
        messages={messages}
        onSendMessage={handleChatSubmit}
        onClearChat={handleClearChat}
        isLoading={isLoading}
      />
    </section>
  );
}
