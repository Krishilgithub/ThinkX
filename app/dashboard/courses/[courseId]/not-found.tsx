import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookX, BookOpen } from "lucide-react";

export default function CourseNotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-10 pb-8 px-6 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <BookX className="h-12 w-12 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold font-heading">
                            Course Not Found
                        </h2>
                        <p className="text-muted-foreground">
                            This course doesn't exist or you don't have access to it.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <Button asChild className="w-full">
                            <Link href="/dashboard/courses">
                                <BookOpen className="mr-2 h-4 w-4" />
                                View My Courses
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/create">
                                Create New Course
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
