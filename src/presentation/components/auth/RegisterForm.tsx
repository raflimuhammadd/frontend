"use client";

import { DepartmentBadge, RoleBadge } from "@/presentation/components/ui/Badge";
import { useAuthStore } from "@/shared/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthLayout } from "./AuthLayout";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.enum(["PM", "FRONTEND", "BACKEND", "UIUX", "CLIENT_GUEST"]),
    department: z.enum(["PRODUCT", "ENGINEERING", "DESIGN", "CLIENT"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CLIENT_GUEST",
      department: "CLIENT",
    },
  });

  const selectedRole = watch("role");
  const selectedDepartment = watch("department");

  const departmentOptions = [
    { value: "PRODUCT", label: "Product Management" },
    { value: "ENGINEERING", label: "Engineering" },
    { value: "DESIGN", label: "Design" },
    { value: "CLIENT", label: "Client" },
  ];

  const roleOptions = [
    { value: "PM", label: "Product Manager" },
    { value: "FRONTEND", label: "Frontend Engineer" },
    { value: "BACKEND", label: "Backend Engineer" },
    { value: "UIUX", label: "UI/UX Designer" },
    { value: "CLIENT_GUEST", label: "Client Guest" },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          department: data.department,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      setAuth(result.data.token, result.data.user);
      router.push("/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout
      variant="register"
      title="Create account."
      subtitle="Join your team's delivery workspace."
    >
      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-status-blocked/10 border border-status-blocked/30 p-3 text-[12px] text-status-blocked font-mono">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              className={`w-full h-12 px-4 border bg-white text-[13px] placeholder:text-[#a7b0b8] transition-all focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(230,57,70,.12)] ${
                errors.firstName ? "border-brand-red" : "border-border-light"
              }`}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-brand-red text-[10px] font-mono mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              className={`w-full h-12 px-4 border bg-white text-[13px] placeholder:text-[#a7b0b8] transition-all focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(230,57,70,.12)] ${
                errors.lastName ? "border-brand-red" : "border-border-light"
              }`}
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-brand-red text-[10px] font-mono mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary mb-2"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john@nodewave.com"
            className={`w-full h-12 px-4 border bg-white text-[13px] placeholder:text-[#a7b0b8] transition-all focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(230,57,70,.12)] ${
              errors.email ? "border-brand-red" : "border-border-light"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-brand-red text-[10px] font-mono mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full h-12 pl-4 pr-12 border bg-white text-[13px] placeholder:text-[#a7b0b8] transition-all focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(230,57,70,.12)] ${
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary mb-2"
            >
              Confirm
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full h-12 pl-4 pr-12 border bg-white text-[13px] placeholder:text-[#a7b0b8] transition-all focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(230,57,70,.12)] ${
                  errors.confirmPassword ? "border-brand-red" : "border-border-light"
                }`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-0 h-12 w-12 text-text-secondary hover:text-brand-red"
                aria-label="Show password"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-brand-red text-[10px] font-mono mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary mb-2"
          >
            Role
          </label>
          <select
            id="role"
            className={`w-full h-12 px-4 border bg-white text-[13px] transition-all focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(230,57,70,.12)] ${
              errors.role ? "border-brand-red" : "border-border-light"
            }`}
            {...register("role")}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-brand-red text-[10px] font-mono mt-1">{errors.role.message}</p>
          )}
        </div>
        {selectedRole && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-secondary">Selected role:</span>
            <RoleBadge role={selectedRole as any} />
          </div>
        )}

        {/* Department */}
        <div>
          <label
            htmlFor="department"
            className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary mb-2"
          >
            Department
          </label>
          <select
            id="department"
            className={`w-full h-12 px-4 border bg-white text-[13px] transition-all focus:outline-none focus:border-brand-red focus:shadow-[0_0_0_3px_rgba(230,57,70,.12)] ${
              errors.department ? "border-brand-red" : "border-border-light"
            }`}
            {...register("department")}
          >
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-brand-red text-[10px] font-mono mt-1">{errors.department.message}</p>
          )}
        </div>
        {selectedDepartment && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-secondary">Selected department:</span>
            <DepartmentBadge department={selectedDepartment as any} />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-text-primary text-white font-mono text-[10px] uppercase tracking-wide-16 font-semibold shadow-[4px_4px_0_#e63946] transition-all hover:shadow-[2px_2px_0_#e63946] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Create account
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    </AuthLayout>
  );
}
