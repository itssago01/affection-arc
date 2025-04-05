
import React from "react";
import { MapPin, Users, Heart } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";

interface CitySpotlightProps {
  city?: string;
  description?: string;
  activeUsers?: number;
  matchesToday?: number;
}

const CitySpotlight: React.FC<CitySpotlightProps> = ({
  city = "New York",
  description = "Find the perfect match in the Big Apple! New York is buzzing with singles ready to connect.",
  activeUsers = 8542,
  matchesToday = 423,
}) => {
  return (
    <AnimatedContainer 
      animation="fade-in"
      className="mb-6 p-4 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-primary/10"
    >
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">City Spotlight: {city}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 text-sm">
          <span className="inline-flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-1" /> {activeUsers.toLocaleString()} Active
          </span>
          <span className="inline-flex items-center text-muted-foreground">
            <Heart className="w-4 h-4 mr-1" /> {matchesToday.toLocaleString()} Matches Today
          </span>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Explore City
        </Button>
      </div>
    </AnimatedContainer>
  );
};

export default CitySpotlight;
