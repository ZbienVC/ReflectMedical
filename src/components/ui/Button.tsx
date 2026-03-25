import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className,
    variant = "primary", 
    size = "md",
    children,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    
    const variants = {
      primary: "bg-[#6D28D9] hover:bg-[#5B21B6] active:bg-[#4C1D95] text-white shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50",
      secondary: "bg-white/10 hover:bg-white/15 active:bg-white/20 text-white border border-white/10 hover:border-white/20",
      ghost: "bg-transparent hover:bg-white/5 active:bg-white/10 text-[#A1A1AA] hover:text-white border border-white/10 hover:border-white/20",
      danger: "bg-red-600/20 hover:bg-red-600/30 active:bg-red-600/40 text-red-400 border border-red-500/20 hover:border-red-500/30",
    };
    
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm", 
      lg: "px-6 py-3 text-base"
    };
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
          "transition-colors duration-200 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#0F0F14]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          "select-none touch-manipulation",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        initial={{ scale: 1, y: 0 }}
        whileHover={!disabled && !isLoading ? { 
          scale: 1.02, 
          y: -1,
          transition: { duration: 0.15, ease: "easeOut" }
        } : {}}
        whileTap={!disabled && !isLoading ? { 
          scale: 0.97,
          y: 0,
          transition: { duration: 0.1, ease: "easeIn" }
        } : {}}
        {...props}
      >
        {isLoading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {leftIcon && !isLoading && (
          <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {rightIcon && !isLoading && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
