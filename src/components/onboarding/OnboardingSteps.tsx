
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import step components
import WelcomeStep from "./steps/WelcomeStep";
import PhotosStep from "./steps/PhotosStep";
import AboutStep from "./steps/AboutStep";
import PreferencesStep from "./steps/PreferencesStep";
import ProgressBar from "./ProgressBar";
import StepNavigator from "./StepNavigator";

const steps = [
  {
    id: "welcome",
    title: "Welcome to loveSpark",
    description: "Let's create your profile in a few simple steps",
  },
  {
    id: "photos",
    title: "Add your best photos",
    description: "Upload photos that show the real you",
  },
  {
    id: "about",
    title: "Tell us about yourself",
    description: "Share some details to help find your perfect match",
  },
  {
    id: "preferences",
    title: "Your preferences",
    description: "Let us know what you're looking for",
  },
];

const OnboardingSteps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    bio: "",
    photos: [] as string[],
    interests: [] as string[],
    preferences: {
      ageRange: [18, 50] as [number, number],
      distance: 25,
      gender: "all",
    },
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    age: "",
    photos: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as object || {}),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
      
      if (formErrors[field as keyof typeof formErrors]) {
        setFormErrors({
          ...formErrors,
          [field]: "",
        });
      }
    }
  };

  const handlePhotoUpload = (index: number) => {
    const demoImages = [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    ];
    
    const updatedPhotos = [...formData.photos];
    if (!updatedPhotos[index]) {
      updatedPhotos[index] = demoImages[index % demoImages.length];
      setFormData({
        ...formData,
        photos: updatedPhotos,
      });
    }
    
    if (formErrors.photos) {
      setFormErrors({
        ...formErrors,
        photos: "",
      });
    }
  };

  const validatePhotosStep = (): boolean => {
    const uploadedPhotoCount = formData.photos.filter(photo => photo).length;
    
    if (uploadedPhotoCount < 3) {
      setFormErrors({
        ...formErrors,
        photos: "Please upload at least 3 photos before continuing.",
      });
      return false;
    }
    
    return true;
  };

  const validateAboutStep = (): boolean => {
    let isValid = true;
    const newErrors = { 
      ...formErrors,
      name: "", 
      age: "" 
    };
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    if (!formData.age) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = "You must be at least 18 years old";
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      if (!validatePhotosStep()) {
        return;
      }
    } else if (currentStep === 2) {
      if (!validateAboutStep()) {
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        setIsSubmitting(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("You need to be logged in to create a profile");
          navigate("/");
          return;
        }
        
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          name: formData.name,
          age: parseInt(formData.age) || null,
          location: formData.location,
          bio: formData.bio,
          gender: formData.preferences.gender === "all" ? null : formData.preferences.gender,
          interests: formData.interests,
          images: formData.photos,
        });
        
        if (error) {
          console.error("Error saving profile:", error);
          toast.error("Failed to save your profile. Please try again.");
        } else {
          toast.success("Profile created successfully!");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error during profile creation:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      
      <div className="flex-1 flex flex-col p-6 pt-8">
        <div className="flex-1 flex items-center justify-center">
          {renderStepContent()}
        </div>
        
        <StepNavigator 
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={prevStep}
          onNext={nextStep}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default OnboardingSteps;
