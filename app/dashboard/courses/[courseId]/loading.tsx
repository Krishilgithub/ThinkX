import { Loader2 } from "lucide-react";

export default function CourseLoading() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold font-heading">Loading Course...</h2>
                    <p className="text-sm text-muted-foreground">Preparing your course content</p>
                </div>
            </div>
        </div>
    );
}
