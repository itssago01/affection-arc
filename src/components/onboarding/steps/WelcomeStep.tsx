
import React from "react";
import AnimatedContainer from "../../common/AnimatedContainer";
import { Heart } from "lucide-react";

interface WelcomeStepProps {
  title: string;
  description: string;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ title, description }) => {
  return (
    <div className="text-center max-w-md mx-auto">
      <AnimatedContainer
        className="mb-8 flex justify-center"
        animation="scale-in"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-primary/10">
          <Heart className="w-8 h-8 text-primary" />
        </div>
      </AnimatedContainer>
      <AnimatedContainer animation="slide-up" delay={100}>
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>
      </AnimatedContainer>
    </div>
  );
};

export default WelcomeStep;
