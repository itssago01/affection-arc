import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

// Define types for our context
interface OnboardingFormData {
  name: string;
  age: string;
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  preferences: {
    ageRange: [number, number];
    distance: number;
    gender: string;
  };
}

interface FormErrors {
  name: string;
  age: string;
  photos: string;
}

interface OnboardingContextType {
  currentStep: number;
  formData: OnboardingFormData;
  formErrors: FormErrors;
  isSubmitting: boolean;
  isUploading: boolean;
  nextStep: () => void;
  prevStep: () => void;
  handleChange: (field: string, value: any) => void;
  handlePhotoUpload: (index: number, file?: File) => void;
  handlePhotoDelete: (index: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
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
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    age: "",
    photos: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('user-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error("Failed to upload image. Please try again.");
        return null;
      }
      
      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error in image upload:", error);
      toast.error("Failed to process image. Please try again.");
      return null;
    }
  };

  const handlePhotoUpload = async (index: number, file?: File) => {
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImageToStorage(file);
        
        if (imageUrl) {
          const updatedPhotos = [...formData.photos];
          updatedPhotos[index] = imageUrl;
          
          setFormData({
            ...formData,
            photos: updatedPhotos,
          });
          
          if (formErrors.photos) {
            setFormErrors({
              ...formErrors,
              photos: "",
            });
          }
        }
      } catch (error) {
        console.error("Error handling photo upload:", error);
        toast.error("Failed to upload photo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    } else {
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
    }
  };

  const handlePhotoDelete = (index: number) => {
    try {
      const updatedPhotos = [...formData.photos];
      
      updatedPhotos[index] = "";
      
      setFormData({
        ...formData,
        photos: updatedPhotos,
      });
      
      toast.success("Photo deleted successfully");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
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

  const saveProfile = async () => {
    try {
      setIsSubmitting(true);
      
      if (!user) {
        toast.error("You need to be logged in to create a profile");
        navigate("/auth");
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
  };

  const nextStep = async () => {
    if (isUploading) {
      toast.info("Please wait while your photos are uploading...");
      return;
    }
    
    if (currentStep === 1) {
      if (!validatePhotosStep()) {
        return;
      }
    } else if (currentStep === 2) {
      if (!validateAboutStep()) {
        return;
      }
    }
    
    if (currentStep < 3) {  // 0-3 for 4 steps total
      setCurrentStep(currentStep + 1);
    } else {
      await saveProfile();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        formData,
        formErrors,
        isSubmitting,
        isUploading,
        nextStep,
        prevStep,
        handleChange,
        handlePhotoUpload,
        handlePhotoDelete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
