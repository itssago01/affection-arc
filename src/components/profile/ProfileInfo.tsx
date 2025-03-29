
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar } from "lucide-react";

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
}

const ProfileInfo = ({
  profile,
  tempProfile,
  isEditing,
  handleInputChange,
  handleInterestChange
}: ProfileInfoProps) => {
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
  );
};

export default ProfileInfo;
