"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Image as ImageIcon,
  Video,
  MoreVertical,
  Upload,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteResource } from "@/actions/library";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string | null;
  date: Date;
}

const icons = {
  pdf: FileText,
  image: ImageIcon,
  video: Video,
};

const colors = {
  pdf: "text-red-500 bg-red-50",
  image: "text-blue-500 bg-blue-50",
  video: "text-purple-500 bg-purple-50",
};

export function LibraryClient({
  initialResources,
}: {
  initialResources: Resource[];
}) {
  const [resources, setResources] = useState(initialResources);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    // Optimistic update
    const prev = resources;
    setResources(prev.filter((r) => r.id !== id));

    startTransition(async () => {
      try {
        await deleteResource(id);
        toast.success("Resource deleted");
      } catch (err) {
        setResources(prev);
        toast.error("Failed to delete resource");
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
            Asset Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your uploads, resources, and raw materials.
          </p>
        </div>
        <Button className="shadow-lg shadow-primary/20">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
          No resources found. Upload some files to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {resources.map((asset) => {
            const typeKey = asset.type.toLowerCase().includes("pdf")
              ? "pdf"
              : asset.type.toLowerCase().includes("image")
                ? "image"
                : "video";

            const Icon = icons[typeKey] || FileText;
            const colorClass = colors[typeKey] || colors.pdf;

            return (
              <Card
                key={asset.id}
                className="group hover:shadow-md transition-all cursor-pointer border-border/50 relative"
              >
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="w-full space-y-1">
                    <p
                      className="font-medium text-sm truncate w-full"
                      title={asset.name}
                    >
                      {asset.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {asset.size || "Unknown size"} •{" "}
                      {formatDistanceToNow(new Date(asset.date), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(asset.url, "_blank")}
                        >
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(asset.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
