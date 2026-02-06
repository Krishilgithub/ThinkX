import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function LibraryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Asset Library
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage course materials and resources.
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Library Coming Soon</CardTitle>
          <CardDescription className="max-w-sm">
            Resource library functionality will be added in a future update.
            For now, focus on creating video courses with AI-generated content.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
