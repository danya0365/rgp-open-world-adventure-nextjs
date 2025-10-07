import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  type?: "hp" | "mp" | "stamina" | "exp" | "default";
  showLabel?: boolean;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

/**
 * RPG Progress Bar Component
 * For HP, MP, Stamina, EXP bars
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      type = "default",
      showLabel = true,
      showPercentage = true,
      size = "md",
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const typeStyles = {
      hp: {
        bg: "bg-slate-700",
        fill:
          percentage <= 25
            ? "bg-gradient-to-r from-red-600 to-red-500"
            : percentage <= 50
            ? "bg-gradient-to-r from-amber-600 to-amber-500"
            : "bg-gradient-to-r from-green-600 to-green-500",
        glow:
          percentage <= 25
            ? "shadow-red-500/50"
            : percentage <= 50
            ? "shadow-amber-500/50"
            : "shadow-green-500/50",
        label: "HP",
        textColor: "text-red-400",
      },
      mp: {
        bg: "bg-slate-700",
        fill: "bg-gradient-to-r from-cyan-600 to-blue-500",
        glow: "shadow-cyan-500/50",
        label: "MP",
        textColor: "text-cyan-400",
      },
      stamina: {
        bg: "bg-slate-700",
        fill: "bg-gradient-to-r from-amber-500 to-yellow-500",
        glow: "shadow-amber-500/50",
        label: "Stamina",
        textColor: "text-amber-400",
      },
      exp: {
        bg: "bg-slate-700",
        fill: "bg-gradient-to-r from-purple-600 to-violet-500",
        glow: "shadow-purple-500/50",
        label: "EXP",
        textColor: "text-purple-400",
      },
      default: {
        bg: "bg-slate-700",
        fill: "bg-gradient-to-r from-blue-600 to-blue-500",
        glow: "shadow-blue-500/50",
        label: "",
        textColor: "text-blue-400",
      },
    };

    const sizes = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
    };

    const style = typeStyles[type];

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-1">
            <span className={cn("text-sm font-semibold", style.textColor)}>
              {style.label}
            </span>
            {showPercentage && (
              <span className="text-sm text-gray-400">
                {value}/{max}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            "w-full rounded-full overflow-hidden",
            style.bg,
            sizes[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              style.fill,
              animated && "shadow-lg",
              animated && style.glow
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";
