import Link from "next/link";
import { Zap, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Integrations", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Contact", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold font-heading text-zinc-900">
                ThinkX
              </span>
            </Link>
            <p className="text-zinc-500 mb-6 max-w-sm">
              Empowering educators with AI-driven video generation. Create
              engaging, personalized teaching content in minutes.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"
              >
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-2 gap-8 lg:contents">
            {/* This wrapper is to fix grid alignment if needed, but standard grid is fine */}
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-zinc-900 mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.Product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-600 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-zinc-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.Company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-600 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-zinc-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.Legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-zinc-600 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column - Optional or integrated */}
        </div>

        <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} ThinkX Inc. All rights reserved.
          </p>
          <div className="flex ml-auto items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
