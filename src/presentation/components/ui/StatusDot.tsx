"use client";

import type { TaskStatus } from "@/domain/types";
import React from "react";

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  showLabel?: boolean;
}

const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status, size = "md", pulse = false, showLabel = false, ...props }, ref) => {
    const statusConfig = {
      TODO: {
        color: "#3b82f6",
        label: "Todo",
        dotColor: "bg-status-todo",
      },
      IN_PROGRESS: {
        color: "#f97316",
        label: "In Progress",
        dotColor: "bg-status-in-progress",
      },
      DONE: {
        color: "#059669",
        label: "Done",
        dotColor: "bg-status-done",
      },
      BLOCKED: {
        color: "#dc2626",
        label: "Blocked",
        dotColor: "bg-status-blocked",
        shouldPulse: true,
      },
    }[status];

    const sizes = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    const shouldPulse = pulse || status === "BLOCKED";

    const dotElement = (
      <span
        ref={ref}
        className={`rounded-full ${sizes[size]} ${statusConfig.dotColor} ${shouldPulse ? "animate-pulse-dot" : ""} ${className || ""}`}
        {...props}
      />
    );

    if (!showLabel) {
      return dotElement;
    }

    return (
      <div className="flex items-center gap-2">
        {dotElement}
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] font-semibold">
          {statusConfig.label}
        </span>
      </div>
    );
  },
);

StatusDot.displayName = "StatusDot";

export { StatusDot };
