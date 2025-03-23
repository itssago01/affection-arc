
import React from "react";
import AnimatedContainer from "../../common/AnimatedContainer";
import { cn } from "@/lib/utils";

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
  return (
    <div className="max-w-md mx-auto">
      <AnimatedContainer animation="slide-up">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="space-y-6 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">I'm interested in</label>
            <div className="grid grid-cols-3 gap-3">
              {["Women", "Men", "Everyone"].map((option) => (
                <button
                  key={option}
                  className={cn(
                    "py-2 px-4 rounded-lg border transition-all duration-200",
                    option.toLowerCase() === gender 
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => onPreferenceChange("gender", option.toLowerCase())}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-3 block">
              Age range: {ageRange[0]}-{ageRange[1]}
            </label>
            <div className="h-2 bg-muted rounded-full relative">
              <div 
                className="absolute h-full bg-primary rounded-full" 
                style={{
                  left: `${(ageRange[0] - 18) / (50 - 18) * 100}%`,
                  right: `${100 - ((ageRange[1] - 18) / (50 - 18) * 100)}%`
                }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-pointer"
                style={{ left: `${(ageRange[0] - 18) / (50 - 18) * 100}%` }}
                // In a real app, you'd implement proper slider functionality
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-pointer"
                style={{ left: `${(ageRange[1] - 18) / (50 - 18) * 100}%` }}
                // In a real app, you'd implement proper slider functionality
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Maximum distance: {distance} miles
            </label>
            <div className="h-2 bg-muted rounded-full relative">
              <div 
                className="absolute left-0 h-full bg-primary rounded-full" 
                style={{ right: `${100 - (distance / 50 * 100)}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-pointer"
                style={{ left: `${distance / 50 * 100}%` }}
                // In a real app, you'd implement proper slider functionality
              />
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default PreferencesStep;
