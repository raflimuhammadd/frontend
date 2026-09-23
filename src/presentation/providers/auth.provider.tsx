"use client";

import { useAuthStore } from "@/shared/stores/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasHydrated || hasRedirected.current) return;

    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      hasRedirected.current = true;
      router.push("/login");
    }

    if (isAuthenticated && isPublicRoute) {
      hasRedirected.current = true;
      router.push("/projects");
    }
  }, [isAuthenticated, hasHydrated, pathname, router]);

  useEffect(() => {
    hasRedirected.current = false;
  }, [pathname]);

  if (!hasHydrated) {
    return null;
  }

  return <>{children}</>;
}
