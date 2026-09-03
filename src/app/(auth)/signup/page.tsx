"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NexaLogo } from "@/components/shared/nexa-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createAccount } from "@/lib/auth";
import { useAppStore } from "@/stores/app-store";
import { useRouter } from "next/navigation";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-4 h-4", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-nexa-violet"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await createAccount(name, email, password);
      setUser(user);
      router.push("/app");
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Could not create account.");
    } finally {
      setIsLoading(false);
    }
  };

  function handleOAuth(provider: "google" | "github") {
    setError("");
    router.push(`/api/auth/${provider}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Subtle radial gradient background decoration */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-nexa-violet/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-nexa-indigo/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl shadow-black/10 dark:shadow-black/40 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <NexaLogo size={32} showText />
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start your AI workspace — free, no credit card required
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Johnson"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 bg-background"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-background"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordHints(true)}
                className="h-10 bg-background"
                required
              />

              {/* Password strength hints */}
              {showPasswordHints && password.length > 0 && (
                <div className="mt-2 space-y-1.5 rounded-lg border border-border bg-muted/30 p-3">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div
                        key={rule.label}
                        className={cn(
                          "flex items-center gap-2 text-xs transition-colors",
                          passed ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border transition-all",
                            passed
                              ? "border-nexa-violet/50 bg-nexa-violet/10"
                              : "border-border bg-transparent"
                          )}
                        >
                          {passed && <CheckIcon />}
                        </div>
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="nexa"
              size="lg"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground tracking-widest">
                or
              </span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full gap-3"
              onClick={() => handleOAuth("google")}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full gap-3"
              onClick={() => handleOAuth("github")}
            >
              <GitHubIcon />
              Continue with GitHub
            </Button>
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:text-nexa-violet transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-muted-foreground transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-muted-foreground transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
