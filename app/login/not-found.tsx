import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, Home } from "lucide-react";

export default function AuthNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-10 pb-8 px-6 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <LogIn className="h-12 w-12 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-heading">
                            Page Not Found
                        </h2>
                        <p className="text-muted-foreground">
                            The authentication page you're looking for doesn't exist.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <Button asChild className="w-full">
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                Go to Login
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Go Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
