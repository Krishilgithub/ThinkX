"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background Gradients */}
      <div className="absolute top-0 center-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/40 rounded-full blur-[120px] opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-100 rounded-full px-3 py-1 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-medium text-green-800">
                v2.0 is now live
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Transform Knowledge into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Video
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Create studio-quality personalized teaching videos in minutes. No
              cameras, no actors, no complex editing required. Just high-impact
              learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 text-sm text-zinc-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full border-2 border-white bg-zinc-200`}
                    />
                  ))}
                </div>
                <span>Trusted by 10,000+ educators</span>
              </div>
            </div>
          </motion.div>

          {/* Graphical/Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-[600px] lg:max-w-none"
          >
            <div className="relative group">
              {/* Glass Card Stack Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-emerald-200 rounded-2xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

              <div className="relative bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                {/* Mock UI Header */}
                <div className="h-10 border-b border-zinc-100 bg-zinc-50/50 flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>

                {/* Mock UI Body (Video Player Placeholder) */}
                <div className="aspect-video bg-zinc-100 flex items-center justify-center relative group-hover:bg-zinc-50 transition-colors">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>

                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-zinc-100 group-hover:scale-110 transition-transform cursor-pointer text-primary">
                      <PlayCircle className="w-8 h-8 fill-primary/10" />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-200 shadow-sm">
                      <p className="text-xs font-mono text-emerald-600">
                        Generating: Physics 101 - Motion...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mock UI Timeline */}
                <div className="h-16 bg-white border-t border-zinc-100 p-3 flex items-center space-x-3">
                  <div className="h-1.5 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    02:14 / 05:00
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
