"use client";

import { useAuthStore } from "@/shared/stores/auth.store";
import Link from "next/link";
import React from "react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/projects" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="text-lg font-semibold text-foreground">NodeWave</span>
            </Link>

            <div className="flex gap-4">
              <Link
                href="/projects"
                className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                Projects
              </Link>
              {user.role === "PM" && (
                <Link
                  href="/admin"
                  className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar fallback={`${user.firstName} ${user.lastName}`} src={user.avatar} size="sm" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
