
import React from "react";
import { Crown, Filter } from "lucide-react";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

interface DashboardHeaderProps {
  isSubscribed: boolean;
  remainingSwipes: number;
  toggleFilters: () => void;
  goToSubscription: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isSubscribed,
  remainingSwipes,
  toggleFilters,
  goToSubscription
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Discover</h1>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        {!isSubscribed && (
          <Button 
            variant="premium" 
            size="sm"
            onClick={goToSubscription}
            className="gap-1.5"
          >
            <Crown className="w-4 h-4" /> 
            Upgrade 
            <span className="rounded-full bg-background text-primary px-1.5 py-0.5 text-xs">
              {remainingSwipes} swipes left
            </span>
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleFilters}
          className="relative"
        >
          <Filter className="w-5 h-5" />
          {/* Active filter indicator */}
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
