"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Professor of Biology, Stanford",
    content:
      "ThinkX allowed me to convert my entire semester's lecture notes into engaging video content in a weekend. The student engagement scores have doubled.",
    initials: "SC",
  },
  {
    name: "Mark Thompson",
    role: "L&D Manager, TechFlow",
    content:
      "We reduced our training onboarding time by 60%. The AI avatars are so realistic that new hires didn't even realize they were generated.",
    initials: "MT",
  },
  {
    name: "Elena Rodriguez",
    role: "Online Course Creator",
    content:
      "The ability to edit the script and have the video auto-update is a game changer. No more re-recording for minor mistakes.",
    initials: "ER",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-foreground">
            Loved by <span className="text-primary">educators</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-muted/30 dark:bg-muted/10 border-border hover:border-primary/30 hover:shadow-lg transition-all shadow-sm">
                <CardContent className="pt-8 px-6 pb-8">
                  <Quote className="w-10 h-10 text-primary/20 mb-6" />
                  <p className="text-lg text-foreground mb-8 leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.initials}`}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
