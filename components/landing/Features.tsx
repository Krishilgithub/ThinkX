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
    <section
      id="features"
      className="py-24 bg-zinc-50 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-zinc-900">
            Everything you need to{" "}
            <span className="text-primary relative inline-block">
              scale yourself
              <svg
                className="absolute -bottom-2 left-0 w-full h-2 text-primary/20"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-zinc-600">
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
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-zinc-200/60 shadow-lg shadow-zinc-200/50 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${feature.color.replace(
                      "text-",
                      "bg-",
                    )}/10`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-heading text-zinc-900 group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-zinc-500">
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
