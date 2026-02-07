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
    <footer className="bg-background border-t border-border pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold font-heading text-foreground">
                ThinkX
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering educators with AI-driven video generation. Create
              engaging, personalized teaching content in minutes.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-2">
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest news and updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 ThinkX. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
