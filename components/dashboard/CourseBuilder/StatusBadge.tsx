"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
    status: string;
}

interface StatusConfig {
    icon: LucideIcon;
    label: string;
    variant: "secondary" | "default" | "destructive";
    className?: string;
    animate?: boolean;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const statusConfig: Record<string, StatusConfig> = {
        DRAFT: {
            icon: Clock,
            label: "Draft",
            variant: "secondary",
        },
        GENERATING: {
            icon: Loader2,
            label: "Generating",
            variant: "default",
            animate: true,
        },
        COMPLETED: {
            icon: CheckCircle,
            label: "Ready",
            variant: "default",
            className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        FAILED: {
            icon: AlertCircle,
            label: "Failed",
            variant: "destructive",
        },
        PUBLISHED: {
            icon: CheckCircle,
            label: "Published",
            variant: "default",
            className: "bg-blue-100 text-blue-700 border-blue-200",
        },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
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
