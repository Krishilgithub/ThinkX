"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";

interface Chapter {
    id: string;
    title: string;
    videoUrl: string | null;
    thumbnail: string | null;
    duration: number | null;
    course: {
        id: string;
        title: string;
        subject: string;
        topic: string | null;
        description: string | null;
    };
}

interface LibraryGridProps {
    videos: Chapter[];
}

export function LibraryGrid({ videos }: LibraryGridProps) {
    const [selectedVideo, setSelectedVideo] = useState<{
        url: string;
        title: string;
        description?: string;
    } | null>(null);

    const handleWatchVideo = (chapter: Chapter) => {
        if (chapter.videoUrl) {
            setSelectedVideo({
                url: chapter.videoUrl,
                title: chapter.title,
                description: chapter.course.description || undefined,
            });
        }
    };

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((chapter) => (
                    <Card
                        key={chapter.id}
                        className="hover:shadow-lg transition-all group overflow-hidden cursor-pointer"
                        onClick={() => handleWatchVideo(chapter)}
                    >
                        <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <Play className="h-12 w-12 text-primary opacity-80 group-hover:scale-110 transition-transform" />
                            {chapter.thumbnail && (
                                <img
                                    src={chapter.thumbnail}
                                    alt={chapter.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-30 transition-opacity"
                                />
                            )}
                        </div>
                        <CardHeader className="pb-3">
                            <div>
                                <Badge variant="secondary" className="mb-2">
                                    {chapter.course.subject}
                                </Badge>
                                <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                                    {chapter.title}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {chapter.course.title}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                                {chapter.duration && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {Math.floor(chapter.duration / 60)}:
                                        {String(chapter.duration % 60).padStart(2, "0")}
                                    </span>
                                )}
                                <span className="text-xs text-primary font-medium">
                                    Watch Video
                                </span>
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
