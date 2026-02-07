"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Clock } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";

interface Chapter {
    id: string;
    title: string;
    status: string;
    videoUrl: string | null;
    thumbnail: string | null;
    updatedAt: Date;
    course: {
        id: string;
        title: string;
    };
}

interface RecentVideosGridProps {
    videos: Chapter[];
}

export function RecentVideosGrid({ videos }: RecentVideosGridProps) {
    const [selectedVideo, setSelectedVideo] = useState<{
        url: string;
        title: string;
        description?: string;
    } | null>(null);

    const handleWatchVideo = (chapter: Chapter, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (chapter.videoUrl) {
            setSelectedVideo({
                url: chapter.videoUrl,
                title: chapter.title,
                description: `From course: ${chapter.course.title}`,
            });
        }
    };

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((chapter) => (
                    <Card
                        key={chapter.id}
                        className="hover:shadow-md transition-shadow cursor-pointer group h-full"
                        onClick={(e) => handleWatchVideo(chapter, e)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                                        {chapter.title}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {chapter.course.title}
                                    </p>
                                </div>
                                <Video className="h-5 w-5 text-primary flex-shrink-0" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                            <div className="flex items-center justify-between">
                                <Badge
                                    variant={
                                        chapter.status === "PUBLISHED" ? "default" : "secondary"
                                    }
                                >
                                    {chapter.status}
                                </Badge>
                                {chapter.updatedAt && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(chapter.updatedAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedVideo && (
                <VideoPlayer
                    isOpen={true}
                    onClose={() => setSelectedVideo(null)}
                    videoUrl={selectedVideo.url}
                    title={selectedVideo.title}
                    description={selectedVideo.description}
                />
            )}
        </>
    );
}
