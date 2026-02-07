import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <Card className="max-w-lg w-full border-2">
                <CardContent className="pt-12 pb-8 px-6">
                    <div className="text-center space-y-6">
                        {/* 404 Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <SearchX className="h-24 w-24 text-primary/80" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="space-y-2">
                            <h1 className="text-6xl font-bold text-primary">404</h1>
                            <h2 className="text-2xl font-semibold font-heading">
                                Page Not Found
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button
                                asChild
                                variant="default"
                                className="shadow-lg shadow-primary/20"
                            >
                                <Link href="/dashboard">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go Home
                                </Link>
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="pt-6 border-t">
                            <p className="text-sm text-muted-foreground">
                                Need help?{" "}
                                <Link
                                    href="/dashboard"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Return to home
                                </Link>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
