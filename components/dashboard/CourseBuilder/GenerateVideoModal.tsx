"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Clapperboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVideoJob } from "@/actions/video-generation";
import { toast } from "sonner";

// ... (imports)

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  tone: z.string().default("professional"),
  language: z.string().default("en"),
  avatarId: z.string().default("default-avatar"),
  background: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid HEX color (#RRGGBB)")
    .default("#FFFFFF"),
  visibility: z.string().default("private"),
});

// Preset color palette for quick selection
const PRESET_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Light Blue", value: "#E3F2FD" },
  { name: "Light Green", value: "#E8F5E9" },
  { name: "Light Purple", value: "#F3E5F5" },
  { name: "Light Orange", value: "#FFF3E0" },
  { name: "Dark Blue", value: "#1E3A8A" },
  { name: "Dark Green", value: "#166534" },
  { name: "Black", value: "#000000" },
];

interface GenerateVideoModalProps {
  chapterId: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

// ...

export function GenerateVideoModal({
  chapterId,
  onSuccess,
  trigger,
}: GenerateVideoModalProps) {
  const [open, setOpen] = useState(false);
  // removed useToast hook

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tone: "professional",
      language: "en",
      avatarId: "default-avatar",
      background: "#FFFFFF",
      visibility: "private",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createVideoJob(chapterId, values);

      if (result.error) {
        toast.error("Generation Failed", {
          description: result.error,
        });
        return;
      }

      toast.success("Generation Started", {
        description:
          "Your video is being created. This may take a few minutes.",
      });

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Clapperboard className="w-4 h-4 mr-2" />
            Generate Video
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Generate AI Video</DialogTitle>
          <DialogDescription>
            Create a professional teaching video using AI avatars and narration.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script / Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the text you want the avatar to speak..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum 500 characters. Detailed scripts work best.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="h-10 w-20 rounded border cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#FFFFFF"
                          className="flex-1 font-mono uppercase"
                          maxLength={7}
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => field.onChange(color.value)}
                            className="flex items-center gap-2 p-2 rounded border hover:bg-accent transition-colors text-sm"
                            title={color.name}
                          >
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: color.value }}
                            />
                            <span className="text-xs truncate">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose a background color for your video
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">
                          Enthusiastic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">
                          Private (Only You)
                        </SelectItem>
                        <SelectItem value="public">
                          Public (Students)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Video
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
