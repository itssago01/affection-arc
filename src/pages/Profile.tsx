
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { Edit, Save, MapPin, Calendar, Heart, Mail, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
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

  const [tempProfile, setTempProfile] = useState({ ...profile });

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
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interestsString = e.target.value;
    const interestsArray = interestsString.split(",").map(interest => interest.trim()).filter(Boolean);
    setTempProfile((prev) => ({ ...prev, interests: interestsArray }));
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-4xl pt-20 px-4 md:px-6">
        {/* Header section with user info and images */}
        <div className="mt-8">
          <AnimatedContainer animation="fade-in" className="space-y-8">
            {/* Profile actions */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      icon={<Save className="w-4 h-4" />}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleEdit}
                    icon={<Edit className="w-4 h-4" />}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Photos grid */}
            <div className="grid grid-cols-3 gap-3">
              {profile.images.map((image, index) => (
                <AnimatedContainer 
                  key={index} 
                  animation="scale-in" 
                  delay={index * 100} 
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden",
                    index === 0 ? "col-span-3 md:col-span-2 md:row-span-2" : ""
                  )}
                >
                  <img 
                    src={image} 
                    alt={`${profile.name} photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="glass" size="sm">Change</Button>
                    </div>
                  )}
                </AnimatedContainer>
              ))}
            </div>

            {/* Profile info */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.images[0]} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{profile.joinDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        <Input 
                          name="name"
                          value={tempProfile.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Age</label>
                        <Input 
                          name="age"
                          type="number"
                          value={tempProfile.age}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Location</label>
                        <Input 
                          name="location"
                          value={tempProfile.location}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">About me</label>
                        <textarea 
                          name="bio"
                          value={tempProfile.bio}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-md border border-input bg-background min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Interests (comma-separated)</label>
                        <Input 
                          value={tempProfile.interests.join(", ")}
                          onChange={handleInterestChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-2xl font-semibold mb-1">{profile.name}, {profile.age}</h2>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">About me</h3>
                        <p className="text-muted-foreground">{profile.bio}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Account settings & logout */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Account</h3>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground"
                  icon={<User className="w-4 h-4" />}
                >
                  Account Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground"
                  icon={<Heart className="w-4 h-4" />}
                >
                  Dating Preferences
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground"
                  icon={<Mail className="w-4 h-4" />}
                >
                  Notification Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                  icon={<LogOut className="w-4 h-4" />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default Profile;
