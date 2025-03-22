
import React from "react";
import { Button as UIButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define all supported button variants
type ButtonVariants = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium" | "glass" | "primary";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariants;
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  className,
  icon,
  iconPosition = "left",
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
    
    if (variant === "primary") {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    
    // For standard shadcn UI variants, return undefined to use the default
    return undefined;
  };

  const variantClass = getVariantClass();
  const shadowCnVariant = variantClass ? "default" : 
    (variant === "primary" ? "default" : variant);
  
  const content = (
    <>
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </>
  );
  
  return (
    <UIButton
      variant={shadowCnVariant as any}
      size={size}
      className={cn(variantClass, className)}
      {...props}
    >
      {content}
    </UIButton>
  );
};
