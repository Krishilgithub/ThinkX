"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need technical skills to use ThinkX?",
    answer:
      "Not at all. ThinkX is designed for educators, not video editors. If you can type a lesson plan, you can create a video.",
  },
  {
    question: "Can I use my own voice?",
    answer:
      "Yes! Our Pro plan allows you to clone your voice securely, so your AI avatar speaks with your tone and intonation.",
  },
  {
    question: "How long does it take to generate a video?",
    answer:
      "A typical 5-minute educational video takes about 2-3 minutes to process and render.",
  },
  {
    question: "Is the content copyright-free?",
    answer:
      "Yes, you own all the rights to the videos you create on the platform. The AI-generated images and avatars are licensed for commercial use.",
  },
  {
    question: "Does it integrate with Canvas or Blackboard?",
    answer:
      "Integration with major LMS platforms is available on our Institution plan.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 bg-muted/30 dark:bg-muted/5 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-foreground">
            Frequently asked <span className="text-primary">questions</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left text-lg text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
