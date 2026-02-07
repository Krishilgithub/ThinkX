"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const statusConfig = {
        DRAFT: {
            icon: Clock,
            label: "Draft",
            variant: "secondary" as const,
        },
        GENERATING: {
            icon: Loader2,
            label: "Generating",
            variant: "default" as const,
            animate: true,
        },
        COMPLETED: {
            icon: CheckCircle,
            label: "Ready",
            variant: "default" as const,
            className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        FAILED: {
            icon: AlertCircle,
            label: "Failed",
            variant: "destructive" as const,
        },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={`text-xs font-normal ${config.className || ""}`}
        >
            <Icon className={`h-3 w-3 mr-1 ${config.animate ? 'animate-spin' : ''}`} />
            {config.label}
        </Badge>
    );
}
