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
    color: "text-blue-500",
    delay: 0.1,
  },
  {
    title: "Voice Synthesis",
    description:
      "Natural-sounding AI voices that clone your tone or choose from our premium library.",
    icon: Mic,
    color: "text-purple-500",
    delay: 0.2,
  },
  {
    title: "Dynamic Visuals",
    description:
      "Automatically generate relevant slides, diagrams, and background imagery.",
    icon: Layout,
    color: "text-green-500",
    delay: 0.3,
  },
  {
    title: "Avatar Presenters",
    description:
      "Photorealistic AI avatars that lip-sync perfectly to your generated audio.",
    icon: Users,
    color: "text-orange-500",
    delay: 0.4,
  },
  {
    title: "Engagement Analytics",
    description:
      "Track student attention spans and quiz performance in real-time.",
    icon: BarChart,
    color: "text-red-500",
    delay: 0.5,
  },
  {
    title: "Instant Updates",
    description:
      "Need to change a fact? Edit text and regenerate video in seconds.",
    icon: Sparkles,
    color: "text-yellow-500",
    delay: 0.6,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
            Everything you need to{" "}
            <span className="text-primary">scale yourself</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform handles the heavy lifting of video production, so you
            can focus on what matters most: teaching and curriculum quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/5 border-white/10 hover:border-primary/50 transition-colors duration-300">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${feature.color}`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-heading text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground/80">
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
