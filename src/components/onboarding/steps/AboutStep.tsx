
import React from "react";
import AnimatedContainer from "../../common/AnimatedContainer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AboutStepProps {
  title: string;
  description: string;
  name: string;
  age: string;
  location: string;
  bio: string;
  onFieldChange: (field: string, value: string) => void;
  errors: {
    name?: string;
    age?: string;
  };
}

const AboutStep: React.FC<AboutStepProps> = ({ 
  title, 
  description, 
  name, 
  age, 
  location, 
  bio, 
  onFieldChange,
  errors
}) => {
  return (
    <div className="max-w-md mx-auto">
      <AnimatedContainer animation="slide-up">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Your name</label>
            <Input 
              type="text" 
              className={`w-full ${errors.name ? 'border-destructive focus:ring-destructive/20' : ''}`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => onFieldChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Age</label>
              <Input 
                type="number" 
                className={`w-full ${errors.age ? 'border-destructive focus:ring-destructive/20' : ''}`}
                placeholder="Your age"
                value={age}
                onChange={(e) => onFieldChange("age", e.target.value)}
              />
              {errors.age && (
                <p className="text-destructive text-sm mt-1">{errors.age}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input
                type="text" 
                className="w-full"
                placeholder="City"
                value={location}
                onChange={(e) => onFieldChange("location", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">About you</label>
            <Textarea 
              className="w-full min-h-[100px]"
              placeholder="Share a bit about yourself..."
              value={bio}
              onChange={(e) => onFieldChange("bio", e.target.value)}
            />
          </div>

          {(errors.name || errors.age) && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fill out all required fields before continuing.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default AboutStep;
