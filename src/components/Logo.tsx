import React from "react";
import { motion } from "framer-motion";
import { practiceInfo } from "../data/practiceData";
import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  fallbackIcon?: React.ReactNode;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md", 
  animate = true,
  fallbackIcon = <Sparkles className="w-5 h-5 text-white" />
}) => {
  const sizes = {
    sm: "h-8",
    md: "h-10", 
    lg: "h-12"
  };

  const fallbackSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const LogoImage = motion.img;
  const FallbackDiv = motion.div;

  const imageProps = {
    src: practiceInfo.logo,
    alt: practiceInfo.name,
    className: `${sizes[size]} w-auto object-contain ${className}`,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      // Fallback to icon if logo fails to load
      const target = e.target as HTMLImageElement;
      target.style.display = 'none';
      const fallback = target.nextElementSibling as HTMLElement;
      if (fallback) fallback.style.display = 'flex';
    }
  };

  const fallbackProps = {
    className: `${fallbackSizes[size]} bg-gradient-to-br from-primary to-secondary rounded-lg hidden items-center justify-center`,
    children: fallbackIcon
  };

  const animationProps = animate ? {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <div className="flex items-center">
      <LogoImage {...imageProps} {...animationProps} />
      <FallbackDiv {...fallbackProps} {...animationProps} />
    </div>
  );
};

export default Logo;