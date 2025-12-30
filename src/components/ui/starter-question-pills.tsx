"use client";

import { cn } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Pill } from "@/components/ui/pill";

export type QuestionCategory = "green" | "blue" | "yellow";

export interface StarterQuestion {
  text: string;
  category: QuestionCategory;
  tooltip: string;
}

// Questions in the exact order specified
const QUESTIONS: StarterQuestion[] = [
  // Row 1 (technical depth)
  {
    text: "Can you explain the architecture of your RAG system?",
    category: "blue",
    tooltip: "Explore system design",
  },
  {
    text: "What is schema-aware parent-child chunking, and why did you need it?",
    category: "green",
    tooltip: "Explore projects",
  },
  {
    text: "How does your retrieval pipeline work end to end?",
    category: "blue",
    tooltip: "Explore system design",
  },
  // Row 2 (production credibility)
  {
    text: "How do you ensure answers stay grounded in real data?",
    category: "blue",
    tooltip: "Explore system design",
  },
  {
    text: "How do you monitor and evaluate LLM performance?",
    category: "blue",
    tooltip: "Explore system design",
  },
  {
    text: "How is this project deployed in production?",
    category: "blue",
    tooltip: "Explore system design",
  },
  // Row 3 (positioning + differentiation)
  {
    text: "How is this project different from a typical chatbot demo?",
    category: "green",
    tooltip: "Explore projects",
  },
  {
    text: "Why did you build an AI that lets people interview your resume?",
    category: "green",
    tooltip: "Explore projects",
  },
  {
    text: "How do you combine data engineering and machine learning?",
    category: "yellow",
    tooltip: "Explore skills",
  },
  // Row 4 (skills + workflow)
  {
    text: "How do you use Dagster in ML workflows?",
    category: "yellow",
    tooltip: "Explore skills",
  },
  {
    text: "What are your strongest technical skills?",
    category: "yellow",
    tooltip: "Explore skills",
  },
];

interface StarterQuestionPillsProps {
  onQuestionClick: (question: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function StarterQuestionPills({
  onQuestionClick,
  isLoading = false,
  className,
}: StarterQuestionPillsProps) {
  const handleClick = (question: string) => {
    if (isLoading) return;
    onQuestionClick(question);
  };

  const getCategoryStyles = (_category: QuestionCategory) => {
    // Glassmorphism style with semi-transparent background, subtle border, and backdrop blur
    return {
      className: "bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(255,255,255,0.05)] border border-white/20 dark:border-white/20 backdrop-blur-[10px] hover:bg-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] hover:border-white/40 dark:hover:border-white/40 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] text-gray-100 dark:text-gray-100 cursor-pointer transition-all duration-200",
    };
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
          className
        )}
      >
        {QUESTIONS.map((question, index) => {
          const styles = getCategoryStyles(question.category);
          return (
            <Tooltip.Root key={index}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => handleClick(question.text)}
                  disabled={isLoading}
                  className={cn(
                    "w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label={question.text}
                >
                  <Pill
                    variant="outline"
                    className={cn(
                      "w-full whitespace-normal",
                      isLoading && "pointer-events-none opacity-50",
                      styles.className
                    )}
                  >
                    <span className="line-clamp-2 text-center leading-snug">{question.text}</span>
                  </Pill>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  className="z-50 overflow-hidden rounded-md bg-muted border border-border px-3 py-1.5 text-xs text-muted-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                  sideOffset={8}
                >
                  {question.tooltip}
                  <Tooltip.Arrow className="fill-muted border-t border-l border-border" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </div>
    </Tooltip.Provider>
  );
}

