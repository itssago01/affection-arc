
import React from "react";
import { Button } from "../common/Button";
import { ArrowRight } from "lucide-react";

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
}) => {
  return (
    <div className="mt-auto pt-6 flex items-center justify-between">
      {currentStep > 0 ? (
        <Button
          variant="ghost"
          onClick={onPrevious}
        >
          Back
        </Button>
      ) : (
        <div /> /* Empty div for layout */
      )}
      
      <Button 
        onClick={onNext}
        icon={<ArrowRight className="w-4 h-4" />}
        iconPosition="right"
        disabled={isSubmitting}
      >
        {currentStep < totalSteps - 1 ? "Continue" : "Get Started"}
      </Button>
    </div>
  );
};

export default StepNavigator;
