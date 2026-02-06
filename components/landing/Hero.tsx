"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
      {/* Background Gradients */}
      <div className="absolute top-0 center-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight text-zinc-900 mb-8 leading-[1.05]">
              Transform knowledge into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 relative">
                Video
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.00025 6.99997C2.00025 6.99997 101.5 2.50004 198.5 2.50004"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Create studio-quality personalized teaching videos in minutes. No
              cameras, no actors, no complex editing required. Just high-impact
              learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-medium shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 rounded-full bg-primary hover:bg-primary/90"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-medium border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 rounded-full transition-all"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-6 text-sm font-medium text-zinc-500">
              <div className="flex items-center">
                <div className="flex -space-x-3 mr-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full border-[3px] border-white bg-zinc-100 flex items-center justify-center overflow-hidden`}
                    >
                      <Image
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                        alt="user"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-zinc-900 font-bold text-base">
                    10,000+
                  </div>
                  <div className="text-xs">Educators trust us</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Graphical/Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="flex-1 w-full max-w-[650px] lg:max-w-none relative z-10"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-3xl blur opacity-30 animate-pulse"></div>
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 bg-white ring-1 ring-zinc-900/5">
              {/* Browser chrome */}
              <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 flex-1 bg-white rounded-md h-6 w-full max-w-sm border border-zinc-200 shadow-sm opacity-50"></div>
              </div>

              <div className="relative aspect-[16/10] bg-zinc-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 max-w-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    <PlayCircle className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      Physics 101 - Motion
                    </div>
                    <div className="text-white/60 text-xs">
                      Generating script...
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute top-1/3 right-8 bg-white shadow-xl p-4 rounded-xl w-48 rotate-[-6deg]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-xs font-bold text-zinc-900">
                      Engagement
                    </div>
                  </div>
                  <div className="h-16 flex items-end justify-between gap-1">
                    {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                      <div
                        key={i}
                        className="w-full bg-primary/20 rounded-t-sm relative group cursor-pointer"
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="absolute bottom-0 w-full bg-primary rounded-t-sm"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
