"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      <header
        className={cn(
          "w-full max-w-5xl rounded-full transition-all duration-300 border border-transparent",
          isScrolled
            ? "glass-card py-3 px-6 shadow-xl border-white/20 bg-white/80 backdrop-blur-xl"
            : "bg-transparent py-4 px-6",
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold font-heading text-xl tracking-tight text-zinc-900">
              ThinkX
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-full px-6"
              asChild
            >
              <Link href="/login">Log In</Link>
            </Button>
            <Button
              className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-900">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-white/95 backdrop-blur-xl border-l border-zinc-200"
              >
                <div className="flex flex-col space-y-6 mt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-zinc-900 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="h-px bg-zinc-200" />
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-zinc-900"
                    asChild
                  >
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button
                    className="w-full rounded-full shadow-lg shadow-primary/20"
                    asChild
                  >
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </motion.nav>
  );
}
