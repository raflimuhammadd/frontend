"use client";

import { Input } from "@/presentation/components/ui/Input";
import { useAuthStore } from "@/shared/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthLayout } from "./AuthLayout";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      setAuth(result.data.token, result.data.user);
      router.push("/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      variant="login"
      title="Welcome back."
      subtitle="Sign in to continue to your delivery workspace."
    >
      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-status-blocked/10 border border-status-blocked/30 p-3 text-[12px] text-status-blocked font-mono">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary"
            >
              Password
            </label>
            <a
              href="#forgot-password"
              className="font-mono text-[10px] uppercase tracking-[.1em] text-brand-red hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full h-12 pl-4 pr-12 border bg-background-card text-[13px] placeholder:text-text-tertiary transition-all focus:outline-none focus:border-brand-red focus:shadow-focus-red ${
                errors.password ? "border-brand-red" : "border-border-light"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-12 w-12 text-text-secondary hover:text-brand-red"
              aria-label="Show password"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-brand-red text-[10px] font-mono mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Device */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-brand-red" />
          <span className="font-mono text-[10px] uppercase tracking-[.1em] text-text-secondary">
            Remember this device
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-text-primary text-white font-mono text-[10px] uppercase tracking-wide-16 font-semibold shadow-red hover:shadow-red-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign in to workspace
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </AuthLayout>
  );
}
