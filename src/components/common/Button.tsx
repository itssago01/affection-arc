
import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  animated?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
  iconPosition = "left",
  fullWidth = false,
  animated = true,
  ...props
}: ButtonProps) => {
  const baseStyles = "font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98]";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm",
    outline: "border border-input bg-transparent hover:bg-muted/50",
    ghost: "hover:bg-muted/50",
    link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
    glass: "glass text-foreground hover:bg-white/80",
  };
  
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
    icon: "p-2 aspect-square",
  };
  
  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
  const fullWidthStyles = "w-full";
  const animatedStyles = "hover:-translate-y-0.5 hover:shadow";

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && disabledStyles,
        fullWidth && fullWidthStyles,
        animated && animatedStyles,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2 inline-flex">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2 inline-flex">{icon}</span>
      )}
    </button>
  );
};

export default Button;
