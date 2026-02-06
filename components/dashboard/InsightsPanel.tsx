"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InsightsPanel() {
  return (
    <Card className="h-full bg-gradient-to-br from-card to-orange-50/50 border-orange-100">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary font-heading text-lg">
          <Sparkles className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/60 p-3 rounded-lg border border-orange-100 shadow-sm">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-green-600 mt-1 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Engagement Spike
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                &quot;Calculus 101&quot; has 40% higher retention than average.
                Consider creating Part 2.
              </p>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary mt-2 text-xs"
              >
                View Analysis
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white/60 p-3 rounded-lg border border-orange-100 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-1 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Content Gap</p>
              <p className="text-xs text-muted-foreground mt-1">
                Students are searching for &quot;Chain Rule&quot; but you have
                no dedicated video.
              </p>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary mt-2 text-xs"
              >
                Generate Draft
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
