
import React from "react";
import { cn } from "@/lib/utils";

type AnimatedContainerProps = {
  children: React.ReactNode;
  className?: string;
  animation?: 
    | "fade-in" 
    | "slide-up" 
    | "slide-down" 
    | "scale-in" 
    | "slide-in-right"
    | "none";
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseMove?: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseUp?: (e: React.MouseEvent | React.TouchEvent) => void;
  onMouseLeave?: (e: React.MouseEvent | React.TouchEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
};

export const AnimatedContainer = ({
  children,
  className = "",
  animation = "fade-in",
  delay = 0,
  duration = 300,
  style = {},
  onClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: AnimatedContainerProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const getAnimationClass = () => {
    if (animation === "none") return "";
    return `animate-${animation}`;
  };

  return (
    <div
      className={cn(
        isVisible ? getAnimationClass() : "opacity-0",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        ...style
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
