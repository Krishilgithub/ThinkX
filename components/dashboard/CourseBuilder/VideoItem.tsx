// This component is DEPRECATED
// Video model no longer exists in the new schema
// Videos are now stored directly in chapters as Chapter.videoUrl
// Use ChapterList component instead

export function VideoItem() {
  return null;
}

return (
  <div
    className={cn(
      "flex items-start gap-x-2 bg-slate-100 border-slate-200 border text-slate-700 rounded-md mb-2 text-sm",
      isProcessing && "bg-slate-50 border-slate-200/60",
    )}
  >
    <div
      className={cn(
        "px-2 py-3 border-r border-slate-200 hover:bg-slate-200 rounded-l-md transition cursor-move h-full flex items-center",
        isProcessing && "opacity-50 cursor-not-allowed",
      )}
    >
      <GripVertical className="h-5 w-5" />
    </div>

    <div className="flex flex-col w-full p-2 gap-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 font-medium">
          <VideoIcon className="h-4 w-4 text-slate-500" />
          {video.title}
        </div>

        <div className="flex items-center gap-x-2">
          {video.status === "COMPLETED" && (
            <Badge
              variant="outline"
              className="bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              Ready
            </Badge>
          )}

          <Button
            onClick={() => onEdit(video)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-slate-900"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(video.id)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status / Player Area */}
      <VideoStatus
        videoId={video.id}
        initialStatus={video.status}
        thumbnailUrl={video.thumbnail}
        videoUrl={video.videoUrl}
      />
    </div>
  </div>
);
}
