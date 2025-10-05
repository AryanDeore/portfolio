"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ChatInput } from "@/components/ui/chat-input";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

export function HeroSection() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Hide scroll indicator after scrolling 50px
      setShowScrollIndicator(scrollY < 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChatSubmit = (message: string) => {
    // TODO: Handle chat message submission
    console.log("Chat message:", message);
  };

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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              Hi, I&apos;m Aryan
            </h1>
            
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium">
              AI Engineer
            </h2>
            
            {/* Tagline */}
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Building LLM-powered tools with LangChain, PyTorch, and fine-tuned LLMs.
            </p>
          </div>

          {/* Chat Input */}
          <div className="pt-8 pb-20">
            <ChatInput onSubmit={handleChatSubmit} />
          </div>
        </div>

      </MaxWidthWrapper>
      
      {/* Scroll Indicator - Fixed at bottom of screen */}
      {showScrollIndicator && (
        <button
          onClick={scrollToNextSection}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full p-2"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground/60 animate-bounce hover:text-muted-foreground transition-colors" />
        </button>
      )}
    </section>
  );
}
