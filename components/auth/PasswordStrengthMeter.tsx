"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "One uppercase letter (A-Z)", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lowercase letter (a-z)", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "One number (0-9)", test: (pwd) => /[0-9]/.test(pwd) },
  {
    label: "One special character (!@#$%...)",
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
];

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordStrengthMeter({
  password,
  showRequirements = true,
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const metRequirements = passwordRequirements.filter((req) =>
      req.test(password),
    ).length;
    setStrength(metRequirements);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-yellow-500";
    if (strength === 4) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Fair";
    if (strength === 4) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Strength Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Password strength</span>
          <span
            className={cn(
              "font-semibold transition-colors duration-300",
              strength <= 2 && "text-red-400",
              strength === 3 && "text-yellow-400",
              strength === 4 && "text-blue-400",
              strength === 5 && "text-emerald-400",
            )}
          >
            {getStrengthLabel()}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-300 ease-out",
                level <= strength ? getStrengthColor() : "bg-zinc-800",
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="p-3 bg-zinc-800/50 backdrop-blur-sm rounded-lg space-y-2 border border-zinc-700">
          <p className="text-xs font-semibold text-zinc-300 mb-2.5">
            Password must contain:
          </p>
          {passwordRequirements.map((requirement, index) => {
            const isMet = requirement.test(password);
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2.5 text-xs transition-all duration-200",
                  isMet ? "text-emerald-400" : "text-zinc-500",
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 rounded-full p-0.5 transition-all duration-200",
                    isMet ? "bg-emerald-500/20" : "bg-zinc-700/50",
                  )}
                >
                  {isMet ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </div>
                <span
                  className={cn(
                    "transition-all duration-200",
                    isMet && "font-medium",
                  )}
                >
                  {requirement.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
