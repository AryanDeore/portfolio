"use client";

import * as React from "react";
import { ExternalLink, Github, ChevronRight, BookOpen, Rocket } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type StatusType = "Featured" | "New" | "Case Study";

interface ProjectCardProps {
  title: string;
  description: string[];
  imageUrl?: string;
  tags?: string[];
  githubUrl?: string;
  blogUrl?: string;
  launchUrl?: string;
  status?: StatusType;
  className?: string;
}

// AspectRatio Component
interface AspectRatioProps {
  ratio: number;
  children: React.ReactNode;
  className?: string;
}

function AspectRatio({ ratio, children, className }: AspectRatioProps) {
  return (
    <div 
      className={cn("relative w-full", className)}
      style={{ aspectRatio: ratio }}
    >
      {children}
    </div>
  );
}

// Image Skeleton Component
function ImageSkeleton() {
  return (
    <div className="w-full h-full bg-muted animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80" />
    </div>
  );
}

// Status Badge Component
// function StatusBadge({ status }: { status: StatusType }) {
//   const statusStyles = {
//     Featured: "bg-primary/15 text-primary ring-1 ring-primary/30",
//     New: "bg-green-600/20 text-green-300 ring-1 ring-green-500/40",
//     "Case Study": "bg-purple-600/20 text-purple-300 ring-1 ring-purple-500/40"
//   };

//   return (
//     <span className={cn(
//       "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm",
//       statusStyles[status]
//     )}>
//       {status}
//     </span>
//   );
// }

export function ProjectCard({
  title,
  description,
  imageUrl,
  tags = [],
  githubUrl,
  blogUrl,
  launchUrl,
  status,
  className,
}: ProjectCardProps) {
  const [imageLoading, setImageLoading] = React.useState(true);
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  
  const combinedDescription = description.join(" ");
  const maxVisibleTags = 5;
  const overflowTagCount = Math.max(0, tags.length - maxVisibleTags);
  const visibleTags = tags.slice(0, maxVisibleTags);

  const handleReadMore = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleTagClick = (tag: string) => {
    console.log(`Tag clicked: ${tag}`);
  };

  return (
    <TooltipProvider>
      <Card className={cn(
        "group relative overflow-hidden rounded-2xl p-0",
        // Modern glass card with layered borders
        "glass-card glass-card-hover",
        // Grid layout for equal heights with auto, flexible content, auto
        "grid grid-rows-[auto_1fr_auto] h-full",
        // Micro-interactions
        "hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary/40",
        className
      )}>
        {/* Optional ambient glow */}
        <div className="pointer-events-none absolute -inset-px rounded-[inherit] bg-[radial-gradient(400px_180px_at_50%_-40%,hsl(var(--primary)/0.10),transparent)] opacity-60" />
        
        {/* Edge-to-edge image section - truly edge-to-edge with shared radius */}
        <div className="relative rounded-t-2xl overflow-hidden">
          <AspectRatio ratio={16/9}>
            {imageUrl ? (
              <>
                {imageLoading && <ImageSkeleton />}
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500 will-change-transform group-hover:scale-[1.02]",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  sizes="(min-width:1024px) 560px, 100vw"
                  priority={false}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </>
            ) : (
              // Default pattern background
              <div className="w-full h-full bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/10 dark:to-blue-900/10 relative">
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #3b82f6 1px, transparent 1px),
                      linear-gradient(-45deg, #3b82f6 1px, transparent 1px)
                    `,
                    backgroundSize: '12px 12px',
                    backgroundPosition: '0 0, 6px 6px'
                  }}
                />
              </div>
            )}
          </AspectRatio>

          {/* Subtle top gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/3 to-transparent dark:from-white/5" />
          
          {/* Status badge positioned in top-right corner
          {status && (
            <div className="absolute top-4 right-4">
              <StatusBadge status={status} />
            </div>
          )} */}
        </div>

        {/* Content section - tighter vertical rhythm */}
        <div className="px-4 pt-0 pb-0 space-y-2">
          <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-sm pt-2 text-muted-foreground line-clamp-4">
            {combinedDescription}
          </p>
          
          {/* Compact tags with tight spacing */}
          {tags.length > 0 && (
            <div className="flex pt-2 pb-0 gap-1 flex-wrap">
              {visibleTags.map((tag, index) => (
                 <button
                   key={index}
                   onClick={() => handleTagClick(tag)}
                   className="px-2 py-0.5  text-xs bg-muted/90 hover:bg-muted rounded-full text-foreground/90 hover:text-foreground transition-all duration-200 hover:scale-105 whitespace-nowrap"
                 >
                  {tag}
                </button>
              ))}
              
            </div>
          )}
        </div>

        {/* CTAs pinned to bottom - always show all three with consistent spacing and alignment */}
        <div className="px-4 pb-4 pt-0 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                asChild={!!githubUrl}
                disabled={!githubUrl}
              >
                {githubUrl ? (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                    <Github className="w-3 h-3" />
                    GitHub
                  </a>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <Github className="w-3 h-3" />
                    GitHub
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{githubUrl ? "View source code" : "Source code not available"}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                asChild={!!blogUrl}
                disabled={!blogUrl}
              >
                {blogUrl ? (
                  <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Blog
                  </a>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Blog
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{blogUrl ? "Read the blog post" : "Blog post not available"}</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                asChild={!!launchUrl}
                disabled={!launchUrl}
              >
                {launchUrl ? (
                  <a href={launchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                    <Rocket className="w-3 h-3" />
                    Launch
                  </a>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <Rocket className="w-3 h-3" />
                    Launch
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{launchUrl ? "View live demo" : "Live demo not available"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </TooltipProvider>
  );
}

// Project Section Header with Filter Chips
interface ProjectSectionHeaderProps {
  title?: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  onViewAll?: () => void;
}

export function ProjectSectionHeader({ 
  title = "Featured Projects", 
  activeFilter = "All",
  onFilterChange,
  onViewAll 
}: ProjectSectionHeaderProps) {
  const filters = ["All", "Web Apps", "AI", "Case Studies"];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange?.(filter)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* View All Link */}
      <button
        onClick={onViewAll}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
      >
        View all projects
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

// Example usage component for demonstration
export function ProjectCardExample() {
  const sampleProject = {
    title: "AI Chat Application",
    description: [
      "Built with Next.js and TypeScript for modern web development. Integrated OpenAI GPT models for intelligent conversations with context awareness. Features real-time messaging with WebSocket connections, user authentication, and a beautiful responsive interface that works across all devices."
    ],
    tags: ["React", "TypeScript", "OpenAI", "WebSocket", "Tailwind", "Node.js", "PostgreSQL", "Prisma"],
    status: "Featured" as const,
    githubUrl: "https://github.com/username/project",
    blogUrl: "https://blog.example.com/project-post",
    launchUrl: "https://project-demo.vercel.app"
  };

  return (
    <div className="max-w-sm">
      <ProjectCard {...sampleProject} />
    </div>
  );
}
