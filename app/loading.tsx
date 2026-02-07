import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold font-heading">Loading...</h2>
                    <p className="text-sm text-muted-foreground">Please wait</p>
                </div>
            </div>
        </div>
    );
}
