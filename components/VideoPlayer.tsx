"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface VideoPlayerProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    title: string;
    description?: string;
}

export function VideoPlayer({
    isOpen,
    onClose,
    videoUrl,
    title,
    description,
}: VideoPlayerProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="text-xl font-bold">
                        {title}
                    </DialogTitle>
                    {description && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {description}
                        </p>
                    )}
                </DialogHeader>

                <div className="aspect-video bg-black">
                    <video
                        className="w-full h-full"
                        controls
                        autoPlay
                        controlsList="nodownload"
                        src={videoUrl}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="p-6 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                        Press ESC or click outside to close the video player
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
