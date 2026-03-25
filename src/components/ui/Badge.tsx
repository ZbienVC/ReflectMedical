import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "premium" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
  animate?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className,
    variant = "default",
    size = "md",
    children,
    animate = false,
    ...props 
  }, ref) => {
    
    const variants = {
      default: "bg-gray-100 text-gray-800 border border-gray-200 shadow-soft",
      success: "bg-medical-green/10 text-medical-green border border-medical-green/20 shadow-soft",
      premium: "bg-premium-gradient text-white border-0 shadow-medium",
      outline: "bg-transparent text-navy border border-navy/30 shadow-soft"
    };
    
    const sizes = {
      sm: "px-2 py-1 text-xs",   // 16px horizontal, 8px vertical
      md: "px-3 py-1.5 text-sm"  // 24px horizontal, 12px vertical
    };
    
    const Component = animate ? motion.div : "div";
    
    const motionProps = animate ? {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.3, ease: "easeOut" }
    } : {};
    
    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
          variants[variant],
          sizes[size],
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };