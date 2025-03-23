
import React from "react";
import AnimatedContainer from "../../common/AnimatedContainer";

interface AboutStepProps {
  title: string;
  description: string;
  name: string;
  age: string;
  location: string;
  bio: string;
  onFieldChange: (field: string, value: string) => void;
}

const AboutStep: React.FC<AboutStepProps> = ({ 
  title, 
  description, 
  name, 
  age, 
  location, 
  bio, 
  onFieldChange 
}) => {
  return (
    <div className="max-w-md mx-auto">
      <AnimatedContainer animation="slide-up">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Your name</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => onFieldChange("name", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Age</label>
              <input 
                type="number" 
                className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Your age"
                value={age}
                onChange={(e) => onFieldChange("age", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="City"
                value={location}
                onChange={(e) => onFieldChange("location", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">About you</label>
            <textarea 
              className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
              placeholder="Share a bit about yourself..."
              value={bio}
              onChange={(e) => onFieldChange("bio", e.target.value)}
            />
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default AboutStep;
