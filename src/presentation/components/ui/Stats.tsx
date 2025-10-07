import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatsProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  label: string;
  value: string | number;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
}

/**
 * RPG Stats Display Component
 * For displaying character stats, game statistics
 */
export const Stats = forwardRef<HTMLDivElement, StatsProps>(
  (
    {
      className,
      icon,
      label,
      value,
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    const variants = {
      default: {
        bg: "bg-slate-800/50",
        iconBg: "bg-slate-700",
        textColor: "text-slate-300",
        valueColor: "text-white",
      },
      primary: {
        bg: "bg-purple-900/30",
        iconBg: "bg-purple-500/20",
        textColor: "text-purple-300",
        valueColor: "text-purple-100",
      },
      success: {
        bg: "bg-green-900/30",
        iconBg: "bg-green-500/20",
        textColor: "text-green-300",
        valueColor: "text-green-100",
      },
      warning: {
        bg: "bg-amber-900/30",
        iconBg: "bg-amber-500/20",
        textColor: "text-amber-300",
        valueColor: "text-amber-100",
      },
      danger: {
        bg: "bg-red-900/30",
        iconBg: "bg-red-500/20",
        textColor: "text-red-300",
        valueColor: "text-red-100",
      },
      info: {
        bg: "bg-blue-900/30",
        iconBg: "bg-blue-500/20",
        textColor: "text-blue-300",
        valueColor: "text-blue-100",
      },
    };

    const sizes = {
      sm: {
        container: "p-3",
        icon: "w-8 h-8 p-1.5",
        iconSize: "w-5 h-5",
        label: "text-xs",
        value: "text-lg",
      },
      md: {
        container: "p-4",
        icon: "w-12 h-12 p-2",
        iconSize: "w-6 h-6",
        label: "text-sm",
        value: "text-2xl",
      },
      lg: {
        container: "p-6",
        icon: "w-16 h-16 p-3",
        iconSize: "w-8 h-8",
        label: "text-base",
        value: "text-3xl",
      },
    };

    const style = variants[variant];
    const sizeStyle = sizes[size];

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105",
          style.bg,
          sizeStyle.container,
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div
              className={cn(
                "rounded-lg flex items-center justify-center flex-shrink-0",
                style.iconBg,
                sizeStyle.icon
              )}
            >
              <div className={cn(style.valueColor, sizeStyle.iconSize)}>
                {icon}
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-medium truncate",
                style.textColor,
                sizeStyle.label
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                "font-bold truncate",
                style.valueColor,
                sizeStyle.value
              )}
            >
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

Stats.displayName = "Stats";
