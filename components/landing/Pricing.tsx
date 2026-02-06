"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individual educators and creators.",
    price: { monthly: 0, yearly: 0 },
    features: [
      "5 videos per month",
      "Standard AI Voices",
      "720p export quality",
      "Basic templates",
      "Watermarked",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious course creators and schools.",
    price: { monthly: 29, yearly: 290 },
    features: [
      "Unlimited videos",
      "Premium AI Voices (Cloning)",
      "4K export quality",
      "Custom branding",
      "No Watermark",
      "Priority Support",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Institution",
    description: "Custom solutions for universities and districts.",
    price: { monthly: "Custom", yearly: "Custom" },
    features: [
      "SSO & Role Management",
      "LMS Integration",
      "Dedicated Success Manager",
      "Custom Avatar Creation",
      "API Access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-zinc-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-zinc-900">
            Simple, transparent <span className="text-primary">pricing</span>
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need more power.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center mb-12 space-x-4">
          <span
            className={cn(
              "text-sm font-medium",
              !isYearly ? "text-zinc-900" : "text-zinc-500",
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 bg-zinc-200 rounded-full p-1 relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <div
              className={cn(
                "w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300",
                isYearly ? "translate-x-6" : "translate-x-0",
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm font-medium",
              isYearly ? "text-zinc-900" : "text-zinc-500",
            )}
          >
            Yearly{" "}
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">
              -20%
            </span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative border-zinc-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col",
                plan.popular
                  ? "border-primary ring-1 ring-primary shadow-primary/10"
                  : "border-zinc-200",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-primary rounded-t-xl" />
              )}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  MOST POPULAR
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl font-bold text-zinc-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  {typeof plan.price.monthly === "number" &&
                  typeof plan.price.yearly === "number" ? (
                    <>
                      <span className="text-4xl font-bold font-heading text-zinc-900">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-zinc-500">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold font-heading text-zinc-900">
                      Custom
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start text-sm text-zinc-600"
                    >
                      <Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <Button
                  className={cn(
                    "w-full h-11",
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white",
                  )}
                  variant={plan.popular ? "default" : "secondary"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
