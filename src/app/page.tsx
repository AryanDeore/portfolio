"use client";

import { useState, useMemo } from "react";
import { HeroSection } from "@/components/hero-section";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { ProjectCard, ProjectSectionHeader } from "@/components/ui/project-card";
import { TagFilter } from "@/components/ui/tag-filter";

// Project data with comprehensive tags
const projects = [
  {
    id: 1,
    title: "AI Chat Application",
    description: [
      "Built with Next.js and TypeScript for modern web development. Integrated OpenAI GPT models for intelligent conversations with context awareness and memory. Features real-time messaging with WebSocket connections, user authentication, and a beautiful responsive interface."
    ],
    tags: ["React", "TypeScript", "OpenAI", "WebSocket", "AI", "Chat", "Real-time", "Authentication"],
    githubUrl: "https://github.com/username/ai-chat",
    blogUrl: "https://blog.example.com/ai-chat-post",
    launchUrl: "https://ai-chat-demo.vercel.app",
    category: "AI"
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: [
      "Full-stack e-commerce solution with Stripe payment integration and inventory management. Features include admin dashboard, order tracking, customer reviews, and mobile-optimized checkout flow with cart persistence."
    ],
    tags: ["Next.js", "Stripe", "PostgreSQL", "Prisma", "E-commerce", "Payment", "Dashboard", "Mobile"],
    githubUrl: "https://github.com/username/ecommerce",
    blogUrl: "https://blog.example.com/ecommerce-post",
    launchUrl: "https://ecommerce-demo.vercel.app",
    category: "Web App"
  },
  {
    id: 3,
    title: "Data Visualization Dashboard",
    description: [
      "Interactive dashboards for complex data analysis with real-time updates. Built with React and D3.js for stunning visualizations, featuring customizable charts, advanced filtering, and export capabilities for business intelligence."
    ],
    tags: ["React", "D3.js", "Python", "FastAPI", "Redis", "Data Viz", "Analytics", "Charts"],
    githubUrl: "https://github.com/username/data-viz",
    blogUrl: "https://blog.example.com/data-viz-post",
    launchUrl: "https://data-viz-demo.vercel.app",
    category: "Analytics"
  },
  {
    id: 4,
    title: "Mobile Banking App",
    description: [
      "Secure mobile banking application with biometric authentication and real-time transaction monitoring. Features include account management, fund transfers, bill payments, and investment tracking with modern UI/UX design."
    ],
    tags: ["React Native", "TypeScript", "Biometric", "Security", "Banking", "Mobile", "Finance", "Authentication"],
    githubUrl: "https://github.com/username/banking-app",
    blogUrl: "https://blog.example.com/banking-app-post",
    launchUrl: "https://banking-demo.vercel.app",
    category: "Mobile"
  },
  {
    id: 5,
    title: "Blockchain Voting System",
    description: [
      "Decentralized voting platform built on Ethereum blockchain ensuring transparency and security. Features smart contracts for vote validation, real-time results, and immutable vote records with modern web interface."
    ],
    tags: ["Blockchain", "Ethereum", "Solidity", "Web3", "Smart Contracts", "Voting", "Decentralized", "Security"],
    githubUrl: "https://github.com/username/blockchain-voting",
    blogUrl: "https://blog.example.com/blockchain-voting-post",
    launchUrl: "https://voting-demo.vercel.app",
    category: "Blockchain"
  },
  {
    id: 6,
    title: "Machine Learning API",
    description: [
      "RESTful API for machine learning model deployment with automatic scaling and monitoring. Supports multiple ML frameworks, batch processing, real-time predictions, and comprehensive analytics dashboard."
    ],
    tags: ["Python", "FastAPI", "Machine Learning", "Docker", "Kubernetes", "API", "ML Ops", "Monitoring"],
    githubUrl: "https://github.com/username/ml-api",
    blogUrl: "https://blog.example.com/ml-api-post",
    launchUrl: "https://ml-api-demo.vercel.app",
    category: "AI"
  }
];

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  // Filter projects based on selected tags
  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) {
      return projects;
    }
    return projects.filter(project =>
      selectedTags.some(tag => project.tags.includes(tag))
    );
  }, [selectedTags]);

  return (
    <>
      <HeroSection />

      {/* Projects Section */}
      <section className="relative py-20 bg-muted/30">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_300px_at_50%_-10%,hsl(var(--primary)/0.04),transparent)]" />
        
        <MaxWidthWrapper maxWidth="6xl">
          <div className="space-y-8">
            {/* Section header */}
            <header className="mb-8 lg:mb-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Projects</h2>
                  <p className="text-muted-foreground">
                    {filteredProjects.length} of {projects.length} projects
                    {selectedTags.length > 0 && ` matching your filters`}
                  </p>
                </div>
              </div>
            </header>

            {/* Tag Filter */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <TagFilter
                availableTags={allTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                placeholder="Search technologies, categories..."
                maxVisibleTags={15}
              />
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  githubUrl={project.githubUrl}
                  blogUrl={project.blogUrl}
                  launchUrl={project.launchUrl}
                />
              ))}
            </div>

            {/* No results message */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-lg font-medium text-muted-foreground mb-2">
                  No projects found
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or clearing all selections
                </p>
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
