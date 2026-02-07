import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-background transition-colors duration-300">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
      <div className="absolute top-0 center-0 w-full h-full overflow-hidden -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight text-foreground">
          Ready to revolutionize your teaching?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join 10,000+ educators creating world-class content with ThinkX today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-14 px-10 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href="/signup">
              Start Creating for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 text-lg border-border text-foreground hover:bg-accent hover:text-primary"
            asChild
          >
            <Link href="#pricing">Compare Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
