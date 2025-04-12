
import React from "react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatingPreferences } from "@/types/messages";
import { Label } from "@/components/ui/label";
import { Heart, MapPin, Users, Goal } from "lucide-react";

interface ProfilePreferencesProps {
  preferences: DatingPreferences;
  isEditing: boolean;
  handlePreferenceChange: (field: keyof DatingPreferences, value: any) => void;
  handleAgeRangeChange: (values: number[]) => void;
}

const ProfilePreferences = ({
  preferences,
  isEditing,
  handlePreferenceChange,
  handleAgeRangeChange
}: ProfilePreferencesProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Dating Preferences</h3>
        
        {/* Gender preference */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-medium">I'm interested in</span>
          </div>
          
          {isEditing ? (
            <RadioGroup 
              value={preferences.gender} 
              onValueChange={(value) => 
                handlePreferenceChange("gender", value as "women" | "men" | "all")
              }
              className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="women" id="women" />
                <Label htmlFor="women">Women</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="men" id="men" />
                <Label htmlFor="men">Men</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Everyone</Label>
              </div>
            </RadioGroup>
          ) : (
            <p className="text-muted-foreground">
              {preferences.gender === "women" ? "Women" : 
               preferences.gender === "men" ? "Men" : "Everyone"}
            </p>
          )}
        </div>
        
        {/* Age range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-medium">Age range</span>
          </div>
          
          {isEditing ? (
            <div className="px-2">
              <Slider 
                defaultValue={preferences.ageRange}
                min={18}
                max={80}
                step={1}
                onValueChange={handleAgeRangeChange}
                className="my-6"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>18</span>
                <span>80</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {preferences.ageRange[0]} - {preferences.ageRange[1]} years old
            </p>
          )}
        </div>
        
        {/* Distance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium">Maximum distance</span>
          </div>
          
          {isEditing ? (
            <div className="px-2">
              <Slider 
                defaultValue={[preferences.distance]}
                min={5}
                max={100}
                step={5}
                onValueChange={(values) => handlePreferenceChange("distance", values[0])}
                className="my-6"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 miles</span>
                <span>100 miles</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {preferences.distance} miles
            </p>
          )}
        </div>
        
        {/* Looking for */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Goal className="h-5 w-5 text-primary" />
            <span className="font-medium">Looking for</span>
          </div>
          
          {isEditing ? (
            <RadioGroup 
              value={preferences.lookingFor} 
              onValueChange={(value) => 
                handlePreferenceChange("lookingFor", value as "casual" | "serious" | "friendship" | "undecided")
              }
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="casual" />
                <Label htmlFor="casual">Casual dating</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="serious" id="serious" />
                <Label htmlFor="serious">Serious relationship</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendship" id="friendship" />
                <Label htmlFor="friendship">Friendship</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="undecided" id="undecided" />
                <Label htmlFor="undecided">Not sure yet</Label>
              </div>
            </RadioGroup>
          ) : (
            <p className="text-muted-foreground">
              {preferences.lookingFor === "casual" ? "Casual dating" : 
              preferences.lookingFor === "serious" ? "Serious relationship" :
              preferences.lookingFor === "friendship" ? "Friendship" : "Not sure yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreferences;
