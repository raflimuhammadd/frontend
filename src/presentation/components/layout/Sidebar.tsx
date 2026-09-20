"use client";

import { useAuthStore } from "@/shared/stores/auth.store";
import {
  MoreVertical,
  LogOut,
  BarChart3,
  CheckSquare2,
  Command,
  FolderKanban,
  History,
  LayoutDashboard,
  Menu,
  Settings2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Avatar } from "../ui/Avatar";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "layout-dashboard": LayoutDashboard,
  "folder-kanban": FolderKanban,
  "check-square-2": CheckSquare2,
  "more-vertical": MoreVertical,
  "log-out": LogOut,
  users: Users,
  "bar-chart-3": BarChart3,
  history: History,
  "settings-2": Settings2,
  menu: Menu,
  x: X,
  command: Command,
};

const LucideIcon = ({ icon, className }: { icon: string; className?: string }) => {
  const Icon = iconMap[icon];
  if (!Icon) return null;
  return <Icon className={className} />;
};

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, hasHydrated  } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems =
    hasHydrated  && user
      ? [
          {
            href: "/",
            label: "Overview",
            icon: "layout-dashboard",
            roles: ["PM", "FRONTEND", "BACKEND", "UIUX"],
            section: "workspace",
          },
          {
            href: "/projects",
            label: "Projects",
            icon: "folder-kanban",
            roles: ["PM", "FRONTEND", "BACKEND", "UIUX"],
            section: "workspace",
          },
          {
            href: "/tasks",
            label: "Tasks",
            icon: "check-square-2",
            roles: ["PM", "FRONTEND", "BACKEND", "UIUX"],
            section: "workspace",
          },
          {
            href: "/team",
            label: "Team",
            icon: "users",
            roles: ["PM", "FRONTEND", "BACKEND", "UIUX"],
            section: "workspace",
          },
          {
            href: "/reports",
            label: "Reports",
            icon: "bar-chart-3",
            roles: ["PM"],
            section: "operations",
          },
          {
            href: "/admin/audit",
            label: "Audit trail",
            icon: "history",
            roles: ["PM"],
            section: "operations",
          },
          {
            href: "/settings",
            label: "Settings",
            icon: "settings-2",
            roles: ["PM"],
            section: "operations",
          },
        ].filter((item) => item.roles.includes(user.role))
      : [];

  const workspaceItems = navItems.filter((item) => item.section === "workspace");
  const operationsItems = navItems.filter((item) => item.section === "operations");

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Menu Button (Mobile) */}
      {mounted && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-[#111827] text-[#e5e5e5] rounded-md"
          aria-label="Toggle menu"
        >
          <LucideIcon icon={isOpen ? "x" : "menu"} className="w-5 h-5" />
        </button>
      )}

      {/* Backdrop (Mobile) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 w-[238px] h-screen bg-brand-dark text-white flex flex-col border-r border-background-dark overflow-hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="h-[84px] px-6 flex items-center border-b border-background-dark">
          <div className="w-8 h-8 border border-brand-red text-brand-red flex items-center justify-center mr-3">
            <Command className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold tracking-tight-05 text-[20px] leading-5 font-heading">
              nodewave
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wide-20 text-text-secondary mt-1">
              control room
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-7 flex-1 overflow-y-auto">
          {!hasHydrated  ? (
            <>
              <div className="px-3 mb-3">
                <div className="h-3 bg-background-dark rounded animate-pulse w-20"></div>
              </div>
              <div className="space-y-1 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-3">
                    <div className="w-4 h-4 bg-background-dark rounded animate-pulse"></div>
                    <div className="h-3 bg-background-dark rounded animate-pulse w-16"></div>
                  </div>
                ))}
              </div>
            </>
          ) : user ? (
            <>
              <p className="px-3 mb-3 text-[10px] uppercase tracking-wide-18 font-semibold text-[#66727e]">
                Workspace
              </p>
              <nav className="space-y-1 mb-8">
                {workspaceItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-3 py-3 text-[12px] uppercase tracking-wide-08 text-[#9ca8b3] hover:text-white hover:bg-[#1a222a] transition-colors
                             ${isActive ? "bg-brand-red text-white font-semibold" : ""}`}
                    >
                      <LucideIcon icon={item.icon} className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {operationsItems.length > 0 && (
                <>
                  <p className="px-3 mb-3 text-[10px] uppercase tracking-wide-18 font-semibold text-[#66727e]">
                    Operations
                  </p>
                  <nav className="space-y-1">
                    {operationsItems.map((item) => {
                      const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeSidebar}
                          className={`flex items-center gap-3 px-3 py-3 text-[12px] uppercase tracking-wide-08 text-[#9ca8b3] hover:text-white hover:bg-[#1a222a] transition-colors
                            ${isActive ? "bg-brand-red text-white font-semibold" : ""}`}
                        >
                          <LucideIcon icon={item.icon} className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-text-secondary py-8 text-[12px]">
              Not authenticated
            </div>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="mt-auto p-4 border-t border-background-dark">
          {!hasHydrated  ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-background-dark rounded animate-pulse"></div>
              <div className="min-w-0 flex-1">
                <div className="h-3 bg-background-dark rounded animate-pulse w-24 mb-1"></div>
                <div className="h-2 bg-background-dark rounded animate-pulse w-16"></div>
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 relative">
              <div className="w-8 h-8 bg-background-dark text-text-on-dark flex items-center justify-center font-mono text-[10px]">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="font-mono text-[9px] uppercase text-text-secondary mt-1">
                  {user.role === "PM" ? "PM / admin" : user.role.toLowerCase()}
                </div>
              </div>

              {/* 3 dots */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-text-secondary hover:text-white transition-colors p-1"
                aria-label="User menu"
              >
                <LucideIcon icon="more-vertical" className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  {/* Dropdown content */}
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a222a] border border-background-dark rounded shadow-lg z-50">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-text-secondary hover:text-white hover:bg-[#111827] transition-colors"
                    >
                      <LucideIcon icon="log-out" className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-[238px] flex-shrink-0" />
    </>
  );
};
