"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BookOpen, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function CourseError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Course Error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-destructive/20">
                <CardContent className="pt-10 pb-8 px-6 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-destructive/10 rounded-full">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-heading">
                            Course Error
                        </h2>
                        <p className="text-muted-foreground">
                            We couldn't load this course. It might not exist or there was an error.
                        </p>
                    </div>

                    {process.env.NODE_ENV === "development" && (
                        <div className="p-3 bg-muted rounded-md text-left">
                            <p className="text-xs text-muted-foreground break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        <Button onClick={reset} className="w-full">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/courses">
                                <BookOpen className="mr-2 h-4 w-4" />
                                My Courses
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
