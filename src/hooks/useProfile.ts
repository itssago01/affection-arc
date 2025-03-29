
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  bio: string;
  joinDate: string;
  interests: string[];
  images: string[];
}

export const useProfile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
  });

  const [tempProfile, setTempProfile] = useState<ProfileData>({ ...profile });

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
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
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleInterestChange,
    handleLogout
  };
};
