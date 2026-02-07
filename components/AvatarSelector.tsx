"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/lib/heygen-avatars";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarSelectorProps {
  value?: string;
  onChange: (avatarId: string) => void;
  className?: string;
}

export function AvatarSelector({
  value,
  onChange,
  className,
}: AvatarSelectorProps) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState<string | null>(null);

  // Fetch avatars from API
  useEffect(() => {
    async function fetchAvatars() {
      try {
        setLoading(true);
        const response = await fetch("/api/heygen/avatars");

        if (!response.ok) {
          throw new Error("Failed to fetch avatars");
        }

        const data = await response.json();

        if (data.success) {
          setAvatars(data.avatars);
        } else {
          throw new Error(data.error || "Failed to load avatars");
        }
      } catch (err) {
        console.error("Error fetching avatars:", err);
        setError(err instanceof Error ? err.message : "Failed to load avatars");
      } finally {
        setLoading(false);
      }
    }

    fetchAvatars();
  }, []);

  // Filter avatars based on search and gender
  const filteredAvatars = avatars.filter((avatar) => {
    const matchesSearch = avatar.avatarName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGender = !genderFilter || avatar.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  // Get unique genders for filter
  const genders = Array.from(
    new Set(avatars.map((a) => a.gender).filter(Boolean)),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading avatars...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="font-medium">Error loading avatars</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2">
          Please ensure avatars are synced. Contact admin if the issue persists.
        </p>
      </div>
    );
  }

  if (avatars.length === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        <p className="font-medium">No avatars available</p>
        <p className="text-sm mt-1">
          Avatars need to be synced from HeyGen API. Please contact your
          administrator.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search avatars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Gender Filter */}
        {genders.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setGenderFilter(null)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                !genderFilter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              All ({avatars.length})
            </button>
            {genders.map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender as string)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize",
                  genderFilter === gender
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                {gender} ({avatars.filter((a) => a.gender === gender).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredAvatars.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No avatars match your search
          </div>
        ) : (
          filteredAvatars.map((avatar) => (
            <Card
              key={avatar.id}
              onClick={() => onChange(avatar.avatarId)}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:scale-105",
                "group relative overflow-hidden",
                value === avatar.avatarId
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:border-primary/50",
              )}
            >
              <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200">
                {avatar.previewImageUrl ? (
                  <img
                    src={avatar.previewImageUrl}
                    alt={avatar.avatarName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {/* Selected Indicator */}
                {value === avatar.avatarId && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-2">
                <p className="text-sm font-medium truncate">
                  {avatar.avatarName}
                </p>
                {avatar.gender && (
                  <Badge
                    variant="secondary"
                    className="mt-1 text-xs capitalize"
                  >
                    {avatar.gender}
                  </Badge>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Selected Avatar Info */}
      {value && (
        <div className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {avatars.find((a) => a.avatarId === value)?.avatarName || value}
          </span>
        </div>
      )}
    </div>
  );
}
