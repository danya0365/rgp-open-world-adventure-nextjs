import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "character" | "item" | "quest" | "enemy" | "skill";
  glow?: boolean;
  hover?: boolean;
}

/**
 * RPG Fantasy Card Component
 * Base card component for game UI elements
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      glow = false,
      hover = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-xl backdrop-blur-sm border transition-all duration-300";

    const variants = {
      default:
        "bg-slate-800/50 border-slate-700 hover:border-slate-600",
      character:
        "bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-500/30 hover:border-purple-500/60",
      item: "bg-gradient-to-br from-blue-900/50 to-blue-950/50 border-blue-500/30 hover:border-blue-500/60",
      quest:
        "bg-gradient-to-br from-amber-900/50 to-amber-950/50 border-amber-500/30 hover:border-amber-500/60",
      enemy:
        "bg-gradient-to-br from-red-900/50 to-red-950/50 border-red-500/30 hover:border-red-500/60",
      skill:
        "bg-gradient-to-br from-cyan-900/50 to-cyan-950/50 border-cyan-500/30 hover:border-cyan-500/60",
    };

    const glowStyles = glow
      ? "shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
      : "";

    const hoverStyles = hover ? "hover:scale-105 cursor-pointer" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          glowStyles,
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pb-4", className)} {...props} />
));

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold text-white", className)}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400 mt-2", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0 flex items-center gap-4", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";
