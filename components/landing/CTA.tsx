import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-0 center-0 w-full h-full overflow-hidden -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-white to-white" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight text-zinc-900">
          Ready to revolutionize your teaching?
        </h2>
        <p className="text-xl text-zinc-600 mb-10 max-w-2xl mx-auto">
          Join 10,000+ educators creating world-class content with ThinkX today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-14 px-10 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-primary hover:bg-primary/90 text-white"
          >
            Start Creating for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 text-lg border-zinc-200 text-zinc-100 hover:bg-zinc-50 hover:text-primary"
          >
            Compare Plans
          </Button>
        </div>
      </div>
    </section>
  );
}
