"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  Zap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/courses" },
  { icon: Library, label: "Library", href: "/dashboard/library" },
];

interface SidebarProps {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight text-foreground">
            ThinkX
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <div className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground group",
              pathname === item.href
                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                : "text-muted-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 mt-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 border border-border">
            {user.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
