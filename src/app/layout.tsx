import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StickyNav } from "@/components/ui/sticky-navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Home as HomeIcon, User, MessageSquare, Briefcase } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Johnson - Full Stack Developer",
  description: "Portfolio showcasing full-stack development expertise.",
  keywords: ["Full Stack Developer", "React", "Next.js", "TypeScript", "Portfolio"],
  authors: [{ name: "Alex Johnson" }],
  creator: "Alex Johnson",
  openGraph: {
    title: "Alex Johnson - Full Stack Developer",
    description: "Portfolio showcasing full-stack development expertise",
    type: "website",
  },
};

const navItems = [
  {
    name: "Ask AI",
    link: "#",
    icon: <HomeIcon className="h-4 w-4 text-muted-foreground" />,
  },
  {
    name: "LOGO",
    link: "#",
    icon: <User className="h-4 w-4 text-muted-foreground" />,
  },
  {
    name: "Projects",
    link: "#projects",
    icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <StickyNav navItems={navItems} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
