
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DatingPreferences } from "@/types/messages";

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  bio: string;
  joinDate: string;
  interests: string[];
  images: string[];
  datingPreferences?: DatingPreferences;
}

export const useProfile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "preferences">("info");
  
  const [profile, setProfile] = useState<ProfileData>({
    name: "Alex Johnson",
    age: 28,
    location: "San Francisco, CA",
    bio: "Passionate about hiking, photography, and trying new restaurants. Looking to meet someone who shares similar interests and enjoys outdoor adventures.",
    joinDate: "Joined April 2023",
    interests: ["Hiking", "Photography", "Travel", "Cooking", "Reading", "Music"],
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    ],
    datingPreferences: {
      gender: "women",
      ageRange: [25, 35],
      distance: 25,
      lookingFor: "serious"
    }
  });

  const [tempProfile, setTempProfile] = useState<ProfileData>({ ...profile });

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: name === "age" ? Number(value) : value }));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interestsString = e.target.value;
    const interestsArray = interestsString.split(",").map(interest => interest.trim()).filter(Boolean);
    setTempProfile((prev) => ({ ...prev, interests: interestsArray }));
  };

  const handleToggleInterest = (interest: string) => {
    setTempProfile((prev) => {
      const interests = [...prev.interests];
      const index = interests.indexOf(interest);
      
      if (index === -1) {
        interests.push(interest);
      } else {
        interests.splice(index, 1);
      }
      
      return { ...prev, interests };
    });
  };

  const handleAddInterest = (interest: string) => {
    if (!interest.trim()) return;
    
    setTempProfile((prev) => {
      if (prev.interests.includes(interest.trim())) return prev;
      return { ...prev, interests: [...prev.interests, interest.trim()] };
    });
  };
  
  const handlePreferenceChange = (field: keyof DatingPreferences, value: any) => {
    setTempProfile((prev) => ({
      ...prev,
      datingPreferences: {
        ...prev.datingPreferences!,
        [field]: value
      }
    }));
  };
  
  const handleAgeRangeChange = (values: number[]) => {
    if (values.length >= 2) {
      setTempProfile((prev) => ({
        ...prev,
        datingPreferences: {
          ...prev.datingPreferences!,
          ageRange: [values[0], values[1]]
        }
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You've been logged out");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return {
    profile,
    tempProfile,
    isEditing,
    activeTab,
    setActiveTab,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleInterestChange,
    handleToggleInterest,
    handleAddInterest,
    handlePreferenceChange,
    handleAgeRangeChange,
    handleLogout
  };
};
