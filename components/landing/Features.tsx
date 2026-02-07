"use client";

import { motion } from "framer-motion";
import { BookOpen, Mic, Layout, Sparkles, BarChart, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
  {
    title: "AI Script Generation",
    description:
      "Turn sparse notes into comprehensive teaching scripts with pedagogical optimization.",
    icon: BookOpen,
    color: "text-blue-500 dark:text-blue-400",
    delay: 0.1,
  },
  {
    title: "Voice Synthesis",
    description:
      "Natural-sounding AI voices that clone your tone or choose from our premium library.",
    icon: Mic,
    color: "text-purple-500 dark:text-purple-400",
    delay: 0.2,
  },
  {
    title: "Dynamic Visuals",
    description:
      "Automatically generate relevant slides, diagrams, and background imagery.",
    icon: Layout,
    color: "text-green-500 dark:text-green-400",
    delay: 0.3,
  },
  {
    title: "Avatar Presenters",
    description:
      "Photorealistic AI avatars that lip-sync perfectly to your generated audio.",
    icon: Users,
    color: "text-orange-500 dark:text-orange-400",
    delay: 0.4,
  },
  {
    title: "Engagement Analytics",
    description:
      "Track student attention spans and quiz performance in real-time.",
    icon: BarChart,
    color: "text-red-500 dark:text-red-400",
    delay: 0.5,
  },
  {
    title: "Instant Updates",
    description:
      "Need to change a fact? Edit text and regenerate video in seconds.",
    icon: Sparkles,
    color: "text-yellow-500 dark:text-yellow-400",
    delay: 0.6,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-muted/30 dark:bg-muted/5 relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-foreground">
            Everything you need to{" "}
            <span className="text-primary relative inline-block">
              teach smarter
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
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our AI-powered platform handles the entire video production pipeline
            so you can focus on what matters—teaching.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <Card className="h-full border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
