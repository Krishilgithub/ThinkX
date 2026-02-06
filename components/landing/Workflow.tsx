"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Mic, Video, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "script",
    title: "1. Prompt to Script",
    description:
      "Describe your topic or paste your notes. Our AI structures it into a pedagogical masterpiece.",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    id: "audio",
    title: "2. Voice Synthesis",
    description:
      "Choose a voice that fits your brand. Clone your own or select from our verified pro instructors.",
    icon: Mic,
    color: "bg-purple-500",
  },
  {
    id: "video",
    title: "3. Visual Generation",
    description:
      "AI generates relevant slides, animations, and an avatar presenter perfectly lip-synced.",
    icon: Video,
    color: "bg-green-500",
  },
  {
    id: "publish",
    title: "4. Edit & Publish",
    description:
      "Fine-tune any detail with our block editor, then export to your LMS or YouTube.",
    icon: Settings2,
    color: "bg-orange-500",
  },
];

export function Workflow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="py-24 bg-white overflow-hidden relative"
    >
      {/* Ambient Background */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-zinc-900">
            From concept to <span className="text-primary">classroom</span> in
            minutes
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Our pipeline automates the tedious parts of video production,
            keeping you in creative control.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Steps List */}
          <div className="flex-1 space-y-4 w-full max-w-lg">
            {steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent",
                  activeStep === index
                    ? "bg-white border-zinc-200 shadow-xl shadow-green-900/5 ring-1 ring-green-500/10"
                    : "hover:bg-zinc-50",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300",
                      activeStep === index
                        ? step.color
                        : "bg-zinc-100 text-zinc-400",
                    )}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-bold text-lg",
                        activeStep === index
                          ? "text-zinc-900"
                          : "text-zinc-500",
                      )}
                    >
                      {step.title}
                    </h3>
                    <AnimatePresence>
                      {activeStep === index && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-zinc-600 mt-2 text-sm leading-relaxed"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Preview */}
          <div className="flex-1 w-full relative">
            <div className="aspect-square md:aspect-video lg:aspect-square relative bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  {/* Mock Visual based on active step */}
                  {activeStep === 0 && (
                    <div className="w-full max-w-sm bg-white p-6 rounded-xl border border-zinc-100 shadow-lg">
                      <div className="h-4 w-1/3 bg-zinc-200 rounded mb-6" />
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-zinc-100 rounded" />
                        <div className="h-2 w-full bg-zinc-100 rounded" />
                        <div className="h-2 w-3/4 bg-zinc-100 rounded" />
                      </div>
                      <div className="mt-8 flex gap-2">
                        <div className="h-8 w-20 bg-green-50 rounded border border-green-200" />
                      </div>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div className="w-full flex items-center justify-center gap-4">
                      <div
                        className="h-24 w-4 bg-purple-200 rounded-full animate-pulse"
                        style={{ animationDelay: "0s" }}
                      />
                      <div
                        className="h-32 w-4 bg-purple-300 rounded-full animate-pulse"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="h-16 w-4 bg-purple-100 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-28 w-4 bg-purple-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      />
                      <div
                        className="h-20 w-4 bg-purple-200 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  )}
                  {activeStep >= 2 && (
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.3)] flex items-center justify-center mb-6">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500">
                        Processing...
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
