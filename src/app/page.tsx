export default function Home() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Alex Johnson&apos;s Portfolio
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Full Stack Developer passionate about creating exceptional digital experiences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div id="about" className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">
              I&apos;m a passionate full-stack developer with expertise in modern web technologies.
            </p>
          </div>
          
          <div id="projects" className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <p className="text-muted-foreground">
              Explore my portfolio of innovative web applications and solutions.
            </p>
          </div>
          
          <div id="contact" className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Let&apos;s connect and discuss your next project or opportunity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
