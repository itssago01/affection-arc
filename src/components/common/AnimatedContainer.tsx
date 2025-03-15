
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
};

export const AnimatedContainer = ({
  children,
  className = "",
  animation = "fade-in",
  delay = 0,
  duration = 300,
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
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
