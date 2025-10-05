import { HeroSection } from "@/components/hero-section";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { ProjectCard, ProjectSectionHeader } from "@/components/ui/project-card";

export default function Home() {
  return (
    <>
      <HeroSection />
      
      {/* Dummy Lorem Ipsum Section */}
      <section className="py-20 bg-background">
        <MaxWidthWrapper maxWidth="4xl">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              About Me
            </h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              
              <p>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
              </p>
              
              <p>
                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
              </p>
              
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
              </p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* Projects Section */}
      <section className="relative py-20 bg-muted/30">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_300px_at_50%_-10%,hsl(var(--primary)/0.04),transparent)]" />
        
        <MaxWidthWrapper maxWidth="6xl">
          <div className="space-y-8">
            {/* Section header with modern spacing */}
            <header className="mb-8 lg:mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Featured Projects</h2>
                <p className="text-muted-foreground mt-2">Selected shipped work & experiments</p>
              </div>
              <a href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                View all →
              </a>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProjectCard
                title="AI Chat Application"
                description={[
                  "Built with Next.js and TypeScript for modern web development. Integrated OpenAI GPT models for intelligent conversations with context awareness and memory. Features real-time messaging with WebSocket connections, user authentication, and a beautiful responsive interface."
                ]}
                tags={["React", "TypeScript", "OpenAI", "WebSocket"]}
                githubUrl="https://github.com/username/ai-chat"
                blogUrl="https://blog.example.com/ai-chat-post"
                launchUrl="https://ai-chat-demo.vercel.app"
              />
              
              <ProjectCard
                title="E-commerce Platform"
                description={[
                  "Full-stack e-commerce solution with Stripe payment integration and inventory management. Features include admin dashboard, order tracking, customer reviews, and mobile-optimized checkout flow with cart persistence."
                ]}
                tags={["Next.js", "Stripe", "PostgreSQL", "Prisma"]}
                githubUrl="https://github.com/username/ecommerce"
                blogUrl="https://blog.example.com/ecommerce-post"
                launchUrl="https://ecommerce-demo.vercel.app"
              />
              
              <ProjectCard
                title="Data Visualization Dashboard"
                description={[
                  "Interactive dashboards for complex data analysis with real-time updates. Built with React and D3.js for stunning visualizations, featuring customizable charts, advanced filtering, and export capabilities for business intelligence."
                ]}
                tags={["React", "D3.js", "Python", "FastAPI", "Redis"]}
                githubUrl="https://github.com/username/data-viz"
                blogUrl="https://blog.example.com/data-viz-post"
                launchUrl="https://ecommerce-demo.vercel.app"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
