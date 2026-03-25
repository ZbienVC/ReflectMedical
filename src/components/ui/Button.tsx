import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
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
      primary: "bg-navy hover:bg-navy/90 text-white shadow-soft hover:shadow-medium",
      secondary: "bg-medical-green hover:bg-medical-green/90 text-white shadow-soft hover:shadow-medium", 
      ghost: "bg-transparent hover:bg-gray-100 text-navy border border-gray-200 hover:border-gray-300"
    };
    
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base", 
      lg: "px-6 py-4 text-base"
    };
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium",
          "transition-colors duration-200 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-navy/20 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "select-none touch-manipulation", // Prevent text selection and improve touch
          // Variant styles
          variants[variant],
          // Size styles
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        initial={{ scale: 1, y: 0 }}
        whileHover={!disabled && !isLoading ? { 
          scale: 1.03, 
          y: -2,
          transition: { duration: 0.2, ease: "easeInOut" }
        } : {}}
        whileTap={!disabled && !isLoading ? { 
          scale: 0.98,
          y: 0,
          transition: { duration: 0.1, ease: "easeInOut" }
        } : {}}
        style={{ zIndex: 1 }} // Ensure buttons are above other elements
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