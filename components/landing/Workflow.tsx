"use client";

import React, { useState } from "react";
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
    color: "bg-blue-500 dark:bg-blue-600",
  },
  {
    id: "audio",
    title: "2. Voice Synthesis",
    description:
      "Choose a voice that fits your brand. Clone your own or select from our verified pro instructors.",
    icon: Mic,
    color: "bg-purple-500 dark:bg-purple-600",
  },
  {
    id: "video",
    title: "3. Visual Generation",
    description:
      "AI generates relevant slides, animations, and an avatar presenter perfectly lip-synced.",
    icon: Video,
    color: "bg-green-500 dark:bg-green-600",
  },
  {
    id: "publish",
    title: "4. Edit & Publish",
    description:
      "Fine-tune any detail with our block editor, then export to your LMS or YouTube.",
    icon: Settings2,
    color: "bg-orange-500 dark:bg-orange-600",
  },
];

export function Workflow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="py-24 bg-background overflow-hidden relative transition-colors duration-300"
    >
      {/* Ambient Background */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-foreground">
            From concept to <span className="text-primary">classroom</span> in
            minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined pipeline turns your ideas into polished teaching
            videos without the hassle.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Steps Navigation */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300",
                  activeStep === index
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-border bg-card/50 hover:border-border hover:bg-muted/30",
                )}
                whileHover={{ x: activeStep === index ? 0 : 4 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md",
                      step.color,
                    )}
                  >
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {activeStep === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Visual Illustration */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden border border-border bg-muted/20 dark:bg-muted/10 shadow-xl flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-12"
              >
                <div
                  className={cn(
                    "w-full h-full rounded-xl flex items-center justify-center text-white shadow-2xl",
                    steps[activeStep].color,
                  )}
                >
                  {React.createElement(steps[activeStep].icon, {
                    className: "w-32 h-32 opacity-20",
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
