
import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${(currentStep + 1) / totalSteps * 100}%` }}
      />
    </div>
  );
};

export default ProgressBar;
