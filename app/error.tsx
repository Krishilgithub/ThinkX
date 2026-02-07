"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
            <Card className="max-w-lg w-full border-2 border-destructive/20">
                <CardContent className="pt-12 pb-8 px-6">
                    <div className="text-center space-y-6">
                        {/* Error Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-destructive/10 rounded-full blur-2xl"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <AlertTriangle className="h-24 w-24 text-destructive/80" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-destructive">
                                Something went wrong!
                            </h1>
                            <h2 className="text-xl font-semibold font-heading text-foreground">
                                Unexpected Error
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                We encountered an unexpected error. Don't worry, we've logged it and will look into it.
                            </p>

                            {/* Error Details (in development) */}
                            {process.env.NODE_ENV === "development" && (
                                <details className="mt-4 text-left">
                                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                        Technical Details
                                    </summary>
                                    <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
                                        {error.message}
                                        {error.digest && `\nError ID: ${error.digest}`}
                                    </pre>
                                </details>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button
                                onClick={reset}
                                variant="default"
                                className="shadow-lg shadow-destructive/20"
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/dashboard">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="pt-6 border-t">
                            <p className="text-sm text-muted-foreground">
                                If this problem persists,{" "}
                                <Link
                                    href="/dashboard"
                                    className="text-primary hover:underline font-medium"
                                >
                                    contact support
                                </Link>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
