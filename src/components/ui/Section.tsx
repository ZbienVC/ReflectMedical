import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  background?: "default" | "gray" | "primary";
  children: React.ReactNode;
  animate?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className,
    spacing = "lg",
    maxWidth = "xl", 
    background = "default",
    children,
    animate = false,
    ...props 
  }, ref) => {
    
    const spacings = {
      sm: "py-6",    // 48px
      md: "py-8",    // 64px
      lg: "py-12",   // 96px
      xl: "py-16"    // 128px
    };
    
    const maxWidths = {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl", 
      xl: "max-w-7xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full"
    };
    
    const backgrounds = {
      default: "bg-background",
      gray: "bg-gray-50",
      primary: "bg-navy text-white"
    };
    
    const Component = animate ? motion.section : "section";
    
    const motionProps = animate ? {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" }
    } : {};
    
    return (
      <Component
        ref={ref}
        className={cn(
          "relative",
          spacings[spacing],
          backgrounds[background],
          className
        )}
        {...motionProps}
        {...props}
      >
        <div className={cn("mx-auto px-4", maxWidths[maxWidth])}>
          {children}
        </div>
      </Component>
    );
  }
);

Section.displayName = "Section";

export { Section };