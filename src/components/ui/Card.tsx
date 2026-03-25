import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className,
    variant = "default",
    padding = "md", 
    children,
    hover = false,
    ...props 
  }, ref) => {
    
    const variants = {
      default: "bg-white border border-gray-200 shadow-soft hover:shadow-medium transition-all duration-200",
      elevated: "bg-white shadow-elevated border-0 hover:shadow-premium transition-all duration-200",
      outlined: "bg-white border border-gray-300 shadow-soft hover:shadow-medium transition-all duration-200"
    };
    
    const paddings = {
      sm: "p-3",   // 24px
      md: "p-4",   // 32px
      lg: "p-6"    // 48px
    };
    
    const Component = hover ? motion.div : "div";
    
    const motionProps = hover ? {
      whileHover: { y: -4, scale: 1.02 },
      transition: { duration: 0.2 }
    } : {};
    
    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-200",
          variants[variant],
          paddings[padding],
          hover && "hover:shadow-elevated cursor-pointer",
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

Card.displayName = "Card";

export { Card };