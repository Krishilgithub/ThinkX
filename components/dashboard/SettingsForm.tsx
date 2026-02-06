"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile, updateSettings } from "@/actions/user";
import { useState, useTransition } from "react";
import { toast } from "sonner"; // Assuming sonner is set up, fallback to simple alert or console
import { Switch } from "@/components/ui/switch";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  avatar: string | null;
  settings: {
    emailNotify: boolean;
    studentNotify: boolean;
    marketingNotify: boolean;
  } | null;
}

export function SettingsForm({ user }: { user: UserData }) {
  const [isPending, startTransition] = useTransition();

  // Local state for inputs to handle changes before submit
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");

  // Settings state
  const [emailNotify, setEmailNotify] = useState(
    user.settings?.emailNotify ?? true,
  );
  const [studentNotify, setStudentNotify] = useState(
    user.settings?.studentNotify ?? true,
  );

  const handleProfileUpdate = () => {
    startTransition(async () => {
      try {
        await updateProfile({ name, bio });
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile.");
      }
    });
  };

  const handleSettingsUpdate = (key: string, val: boolean) => {
    // Optimistic update
    if (key === "emailNotify") setEmailNotify(val);
    if (key === "studentNotify") setStudentNotify(val);

    startTransition(async () => {
      try {
        await updateSettings({ [key]: val });
        toast.success("Settings updated!");
      } catch (error) {
        toast.error("Failed to update settings.");
        // Revert on failure (could be improved)
      }
    });
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="bg-muted/50 p-1 rounded-lg">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your public profile details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    user.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                />
                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <Button variant="outline" disabled>
                Change Avatar
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleProfileUpdate} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what you want to be notified about.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive daily digests of your stats.
                </p>
              </div>
              <Switch
                checked={emailNotify}
                onCheckedChange={(val) =>
                  handleSettingsUpdate("emailNotify", val)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-medium">Student Messages</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when students comment.
                </p>
              </div>
              <Switch
                checked={studentNotify}
                onCheckedChange={(val) =>
                  handleSettingsUpdate("studentNotify", val)
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Password change logic not implemented yet */}
            <div className="p-4 bg-muted/50 rounded text-center text-muted-foreground">
              Password change disabled for demo user.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
