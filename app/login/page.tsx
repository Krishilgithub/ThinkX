"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { Zap, Loader2, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-zinc-950">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-emerald-300/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-all duration-200 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Home</span>
      </Link>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-br from-primary to-emerald-600 p-4 rounded-2xl shadow-2xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold font-heading tracking-tight mb-3 text-white"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-400 text-base"
            >
              Log in to continue creating AI-powered lessons
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-200"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={loading}
                  required
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                  required
                  className="h-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  autoComplete="current-password"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                  className="border-zinc-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-zinc-400 cursor-pointer select-none"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full h-12 text-base font-semibold rounded-full",
                  "bg-gradient-to-r from-primary to-emerald-600",
                  "hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Log in to ThinkX
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-3 text-zinc-500 font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <SocialLoginButtons
                onGoogleLogin={async () => {
                  console.log("Google login");
                }}
                onGithubLogin={async () => {
                  console.log("GitHub login");
                }}
              />

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-zinc-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center text-xs text-zinc-500"
          >
            <p>Protected by industry-standard encryption</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
