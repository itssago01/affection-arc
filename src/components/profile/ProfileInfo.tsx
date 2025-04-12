import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, X, Plus } from "lucide-react";

interface ProfileData {
  name: string;
  age: number;
  location: string;
  bio: string;
  joinDate: string;
  interests: string[];
  images: string[];
}

interface ProfileInfoProps {
  profile: ProfileData;
  tempProfile: ProfileData;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInterestChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleInterest?: (interest: string) => void;
  handleAddInterest?: (interest: string) => void;
}

const COMMON_INTERESTS = [
  "Hiking", "Photography", "Travel", "Cooking", "Reading", "Music",
  "Movies", "Art", "Sports", "Gaming", "Yoga", "Dancing",
  "Fitness", "Technology", "Nature", "Fashion", "Coffee", "Wine",
  "Pets", "Volunteering", "Languages", "Meditation", "Cycling"
];

const ProfileInfo = ({
  profile,
  tempProfile,
  isEditing,
  handleInputChange,
  handleInterestChange,
  handleToggleInterest,
  handleAddInterest
}: ProfileInfoProps) => {
  const [newInterest, setNewInterest] = useState("");

  const addInterest = () => {
    if (handleAddInterest && newInterest.trim()) {
      handleAddInterest(newInterest);
      setNewInterest("");
    }
  };

  return (
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
              <div className="space-y-3">
                <label className="text-sm font-medium mb-1 block">Interests</label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {tempProfile.interests.map((interest, idx) => (
                    <Badge 
                      key={idx}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-1"
                    >
                      {interest}
                      {handleToggleInterest && (
                        <button 
                          onClick={() => handleToggleInterest(interest)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {handleAddInterest && (
                  <div className="flex gap-2">
                    <Input 
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add a custom interest"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInterest();
                        }
                      }}
                    />
                    <Button 
                      onClick={addInterest}
                      icon={<Plus className="h-4 w-4" />}
                      disabled={!newInterest.trim()}
                    >
                      Add
                    </Button>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Common interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_INTERESTS.filter(interest => !tempProfile.interests.includes(interest))
                      .slice(0, 12)
                      .map((interest, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleToggleInterest && handleToggleInterest(interest)}
                        >
                          + {interest}
                        </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="sr-only">
                  <Input 
                    value={tempProfile.interests.join(", ")}
                    onChange={handleInterestChange}
                  />
                </div>
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
                    <Badge 
                      key={idx}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
