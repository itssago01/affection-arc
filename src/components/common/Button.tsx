
import React from "react";
import { Button as UIButton } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Extend the button variants to include a new 'premium' variant
type ButtonVariants = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium" | "glass";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariants;
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  className,
  ...props
}) => {
  // Map our custom variants to shadcn UI button styles
  const getVariantClass = () => {
    if (variant === "premium") {
      return "bg-gradient-to-r from-amber-400 to-pink-500 text-white hover:from-amber-500 hover:to-pink-600";
    }
    
    if (variant === "glass") {
      return "backdrop-blur-md bg-white/10 text-white border border-white/20 hover:bg-white/20";
    }
    
    // For other variants, use the default shadcn UI styles
    return undefined;
  };

  const variantClass = getVariantClass();
  
  return (
    <UIButton
      variant={variantClass ? "default" : variant}
      size={size}
      className={cn(variantClass, className)}
      {...props}
    >
      {children}
    </UIButton>
  );
};
