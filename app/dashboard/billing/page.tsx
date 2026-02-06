"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your plan, billing history, and payment methods.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Plan */}
        <Card className="border-primary/50 shadow-md shadow-primary/5 bg-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-primary text-primary-foreground hover:bg-primary">
              Active
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Pro Plan
            </CardTitle>
            <CardDescription className="text-foreground/80">
              For professional educators and creators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">
              $29
              <span className="text-base font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>Unlimited Video Generation (up to 120 mins/mo)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>Advanced AI Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" />
                <span>Priority Support</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Manage Subscription
            </Button>
          </CardFooter>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Usage</CardTitle>
            <CardDescription>
              Your consumption for the current billing cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Video Minutes</span>
                <span className="text-muted-foreground">85 / 120</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">AI Captions</span>
                <span className="text-muted-foreground">Unlimited</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-full" />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Need more credits?</p>
                  <p className="text-xs text-muted-foreground">
                    Upgrade to Enterprise for unlimited access.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary text-xs mt-1"
                  >
                    View Enterprise Plans
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded">
                <CreditCard className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/28</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
