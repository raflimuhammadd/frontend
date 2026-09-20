"use client";

import { useAuthStore } from "@/shared/stores/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated ) return;

    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
    }

    if (isAuthenticated && isPublicRoute) {
      router.push("/projects");
    }
  }, [isAuthenticated, hasHydrated, pathname, router]);

  return <>{children}</>;
}
