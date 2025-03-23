
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight, Upload, Heart, User } from "lucide-react";
import { Button } from "../common/Button";
import AnimatedContainer from "../common/AnimatedContainer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
  {
    id: "welcome",
    title: "Welcome to loveSpark",
    description: "Let's create your profile in a few simple steps",
    icon: <Heart className="w-8 h-8 text-primary" />,
  },
  {
    id: "photos",
    title: "Add your best photos",
    description: "Upload photos that show the real you",
    icon: <Upload className="w-8 h-8 text-primary" />,
  },
  {
    id: "about",
    title: "Tell us about yourself",
    description: "Share some details to help find your perfect match",
    icon: <User className="w-8 h-8 text-primary" />,
  },
  {
    id: "preferences",
    title: "Your preferences",
    description: "Let us know what you're looking for",
    icon: <Heart className="w-8 h-8 text-primary" />,
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
      ageRange: [18, 50],
      distance: 25,
      gender: "all",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData({
        ...formData,
        [parent]: {
          // Fix this part - the error was happening here when accessing formData[parent]
          ...(formData[parent as keyof typeof formData] as object || {}),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding by saving profile to Supabase
      try {
        setIsSubmitting(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("You need to be logged in to create a profile");
          navigate("/");
          return;
        }
        
        // Create profile in Supabase
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          name: formData.name,
          age: parseInt(formData.age) || null,
          location: formData.location,
          bio: formData.bio,
          gender: formData.preferences.gender === "all" ? null : formData.preferences.gender,
          interests: formData.interests,
          images: formData.photos,
          // We're not setting looking_for here since we need to map the preferences
          // to the correct format expected by the database
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

  // Demo placeholder content for each step
  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case "welcome":
        return (
          <div className="text-center max-w-md mx-auto">
            <AnimatedContainer
              className="mb-8 flex justify-center"
              animation="scale-in"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-primary/10">
                {step.icon}
              </div>
            </AnimatedContainer>
            <AnimatedContainer animation="slide-up" delay={100}>
              <h1 className="text-3xl font-bold mb-3">{step.title}</h1>
              <p className="text-muted-foreground mb-8">{step.description}</p>
            </AnimatedContainer>
          </div>
        );
      
      case "photos":
        return (
          <div className="max-w-md mx-auto">
            <AnimatedContainer animation="slide-up">
              <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
              <p className="text-muted-foreground mb-6">{step.description}</p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors duration-200",
                      idx < 2 && "border-primary/50"
                    )}
                    onClick={() => {
                      // Here you would typically implement an image upload
                      // For demo purposes, we'll just add a placeholder URL
                      const demoImages = [
                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                        "https://images.unsplash.com/photo-1517841905240-472988babdf9",
                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                      ];
                      
                      // Add the image to the photos array if not already there
                      const updatedPhotos = [...formData.photos];
                      if (!updatedPhotos[idx]) {
                        updatedPhotos[idx] = demoImages[idx % demoImages.length];
                        setFormData({
                          ...formData,
                          photos: updatedPhotos,
                        });
                      }
                    }}
                  >
                    {formData.photos[idx] ? (
                      <img 
                        src={formData.photos[idx]}
                        alt={`User photo ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className={cn(
                        "w-6 h-6",
                        idx < 2 ? "text-primary" : "text-muted-foreground"
                      )} />
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">
                Upload at least 2 photos to continue. Tap each box to upload.
              </p>
            </AnimatedContainer>
          </div>
        );
      
      case "about":
        return (
          <div className="max-w-md mx-auto">
            <AnimatedContainer animation="slide-up">
              <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
              <p className="text-muted-foreground mb-6">{step.description}</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">Your name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Age</label>
                    <input 
                      type="number" 
                      className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="City"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">About you</label>
                  <textarea 
                    className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                    placeholder="Share a bit about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                  />
                </div>
              </div>
            </AnimatedContainer>
          </div>
        );
      
      case "preferences":
        return (
          <div className="max-w-md mx-auto">
            <AnimatedContainer animation="slide-up">
              <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
              <p className="text-muted-foreground mb-6">{step.description}</p>
              
              <div className="space-y-6 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">I'm interested in</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Women", "Men", "Everyone"].map((option) => (
                      <button
                        key={option}
                        className={cn(
                          "py-2 px-4 rounded-lg border transition-all duration-200",
                          option.toLowerCase() === formData.preferences.gender 
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleChange("preferences.gender", option.toLowerCase())}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Age range: {formData.preferences.ageRange[0]}-{formData.preferences.ageRange[1]}
                  </label>
                  <div className="h-2 bg-muted rounded-full relative">
                    <div 
                      className="absolute h-full bg-primary rounded-full" 
                      style={{
                        left: `${(formData.preferences.ageRange[0] - 18) / (50 - 18) * 100}%`,
                        right: `${100 - ((formData.preferences.ageRange[1] - 18) / (50 - 18) * 100)}%`
                      }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-pointer"
                      style={{ left: `${(formData.preferences.ageRange[0] - 18) / (50 - 18) * 100}%` }}
                      // In a real app, you'd implement proper slider functionality
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-pointer"
                      style={{ left: `${(formData.preferences.ageRange[1] - 18) / (50 - 18) * 100}%` }}
                      // In a real app, you'd implement proper slider functionality
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Maximum distance: {formData.preferences.distance} miles
                  </label>
                  <div className="h-2 bg-muted rounded-full relative">
                    <div 
                      className="absolute left-0 h-full bg-primary rounded-full" 
                      style={{ right: `${100 - (formData.preferences.distance / 50 * 100)}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-pointer"
                      style={{ left: `${formData.preferences.distance / 50 * 100}%` }}
                      // In a real app, you'd implement proper slider functionality
                    />
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${(currentStep + 1) / steps.length * 100}%` }}
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col p-6 pt-8">
        {/* Step content */}
        <div className="flex-1 flex items-center justify-center">
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          {currentStep > 0 ? (
            <Button
              variant="ghost"
              onClick={prevStep}
            >
              Back
            </Button>
          ) : (
            <div /> /* Empty div for layout */
          )}
          
          <Button 
            onClick={nextStep}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            disabled={isSubmitting}
          >
            {currentStep < steps.length - 1 ? "Continue" : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps;
