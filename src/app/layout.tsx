import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import { StickyNav } from "@/components/ui/sticky-navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatProvider } from "@/components/chat-context";
import { ChatButton } from "@/components/ui/chat-button";
import { Home as HomeIcon, Briefcase } from "lucide-react";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aryan AI Dev",
  description: "Portfolio showcasing AI development expertise.",
  keywords: ["AI Developer", "Python", "LLM", "Langchain"],
  authors: [{ name: "Aryan" }],
  creator: "Aryan",
  openGraph: {
    title: "Aryan - AI Developer",
    description: "Portfolio showcasing AI development expertise",
    type: "website",
    images: ["/favicon.svg"],
  },
};

const navItems = [
  {
    name: "Ask AI",
    link: "#",
    icon: <HomeIcon className="h-4 w-4 text-muted-foreground" />,
  },
  {
    name: "",
    link: "#",
    icon: <Image src="/website-icon.svg" alt="Logo" width={10} height={10} className="h-15 w-15" />,
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
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ChatProvider>
            <StickyNav navItems={navItems} />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <ChatButton />
          </ChatProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
