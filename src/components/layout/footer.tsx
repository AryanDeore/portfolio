"use client";

import { Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

export function Footer() {

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/AryanDeore",
      label: "@AryanDeore"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/aryandeore",
      label: "@aryandeore"
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:alex@alexjohnson.dev",
      label: "aryandeore.work@gmail.com"
    }
  ];

  const quickLinks = [
    // { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    // { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
    { name: "Blogs", href: "/blogs" }

  ];

  return (
    <footer className="bg-card border-t">
      <MaxWidthWrapper maxWidth="6xl" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aryan Deore</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI Engineer experienced in SDE, MLOps, and LLM fine-tuning. 
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Available for hire</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Get In Touch</h4>
            <div className="space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{social.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* <p className="text-sm text-muted-foreground">
            © {currentYear} Aryan Deore. All rights reserved.
          </p> */}
          {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div> */}
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
