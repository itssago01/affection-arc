
import React from "react";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import StepRenderer from "./StepRenderer";
import ProgressBar from "./ProgressBar";
import StepNavigator from "./StepNavigator";

// This component should use the context
const OnboardingStepsContent: React.FC = () => {
  const { currentStep, isSubmitting, isUploading, nextStep, prevStep } = useOnboarding();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressBar currentStep={currentStep} totalSteps={4} />
      
      <div className="flex-1 flex flex-col p-6 pt-8">
        <div className="flex-1 flex items-center justify-center">
          <StepRenderer />
        </div>
        
        <StepNavigator 
          currentStep={currentStep}
          totalSteps={4}
          onPrevious={prevStep}
          onNext={nextStep}
          isSubmitting={isSubmitting || isUploading}
        />
      </div>
    </div>
  );
};

// Wrapper component that provides the context
const OnboardingSteps: React.FC = () => {
  return (
    <OnboardingProvider>
      <OnboardingStepsContent />
    </OnboardingProvider>
  );
};

export default OnboardingSteps;
