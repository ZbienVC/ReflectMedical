import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
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
      default: "bg-[#1C1C24] border border-white/5",
      elevated: "bg-[#1C1C24] border border-white/8 shadow-xl shadow-black/40",
      outlined: "bg-transparent border border-white/10",
    };
    
    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
    };
    
    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={cn(
            "rounded-2xl transition-colors duration-200",
            variants[variant],
            paddings[padding],
            "hover:border-purple-500/20 cursor-pointer",
            className
          )}
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          variants[variant],
          paddings[padding],
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

export { Card };
