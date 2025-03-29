
import React from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { onboardingSteps } from "./OnboardingStepsConfig";

// Import step components
import WelcomeStep from "./steps/WelcomeStep";
import PhotosStep from "./steps/PhotosStep";
import AboutStep from "./steps/AboutStep";
import PreferencesStep from "./steps/PreferencesStep";

const StepRenderer: React.FC = () => {
  const { 
    currentStep, 
    formData, 
    formErrors, 
    handleChange, 
    handlePhotoUpload,
    handlePhotoDelete 
  } = useOnboarding();
  
  const step = onboardingSteps[currentStep];
  
  switch (step.id) {
    case "welcome":
      return (
        <WelcomeStep 
          title={step.title} 
          description={step.description} 
        />
      );
    
    case "photos":
      return (
        <PhotosStep 
          title={step.title} 
          description={step.description}
          photos={formData.photos}
          onPhotoUpload={handlePhotoUpload}
          onPhotoDelete={handlePhotoDelete}
          error={formErrors.photos}
        />
      );
    
    case "about":
      return (
        <AboutStep 
          title={step.title} 
          description={step.description}
          name={formData.name}
          age={formData.age}
          location={formData.location}
          bio={formData.bio}
          onFieldChange={handleChange}
          errors={formErrors}
        />
      );
    
    case "preferences":
      return (
        <PreferencesStep 
          title={step.title} 
          description={step.description}
          gender={formData.preferences.gender}
          ageRange={formData.preferences.ageRange}
          distance={formData.preferences.distance}
          onPreferenceChange={handleChange}
        />
      );
    
    default:
      return null;
  }
};

export default StepRenderer;
