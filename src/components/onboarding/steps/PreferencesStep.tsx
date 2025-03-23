
import React from "react";
import AnimatedContainer from "../../common/AnimatedContainer";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Heart, Users, MapPin } from "lucide-react";

interface PreferencesStepProps {
  title: string;
  description: string;
  gender: string;
  ageRange: [number, number];
  distance: number;
  onPreferenceChange: (field: string, value: any) => void;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ 
  title, 
  description, 
  gender,
  ageRange,
  distance,
  onPreferenceChange
}) => {
  const handleAgeRangeChange = (values: number[]) => {
    onPreferenceChange("preferences.ageRange", [values[0], values[1]]);
  };

  const handleDistanceChange = (values: number[]) => {
    onPreferenceChange("preferences.distance", values[0]);
  };

  return (
    <div className="max-w-md mx-auto">
      <AnimatedContainer animation="slide-up">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="space-y-8 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-5 w-5 text-primary" />
              <label className="text-sm font-medium block">I'm interested in</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["women", "men", "all"].map((option) => (
                <button
                  key={option}
                  className={cn(
                    "py-2 px-4 rounded-lg border transition-all duration-200",
                    option === gender 
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => onPreferenceChange("preferences.gender", option)}
                >
                  {option === "women" ? "Women" : option === "men" ? "Men" : "Everyone"}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <label className="text-sm font-medium block">
                Age range: {ageRange[0]}-{ageRange[1]}
              </label>
            </div>
            <Slider 
              defaultValue={[ageRange[0], ageRange[1]]}
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
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <label className="text-sm font-medium block">
                Maximum distance: {distance} miles
              </label>
            </div>
            <Slider 
              defaultValue={[distance]}
              min={5}
              max={100}
              step={5}
              onValueChange={handleDistanceChange}
              className="my-6"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 miles</span>
              <span>100 miles</span>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default PreferencesStep;
