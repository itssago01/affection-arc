
import React from "react";
import { Heart, Crown } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";
import ProfileCard, { ProfileData } from "@/components/profile/ProfileCard";

interface ProfileCardSectionProps {
  currentProfile: ProfileData | null;
  noMoreProfiles: boolean;
  canSwipe: boolean;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onRefresh: () => void;
  onUpgrade: () => void;
}

const ProfileCardSection: React.FC<ProfileCardSectionProps> = ({
  currentProfile,
  noMoreProfiles,
  canSwipe,
  onLike,
  onDislike,
  onRefresh,
  onUpgrade
}) => {
  return (
    <div className="flex justify-center mb-6">
      {noMoreProfiles ? (
        <AnimatedContainer
          animation="scale-in"
          className="text-center p-8 rounded-xl border border-border max-w-sm w-full"
        >
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">No more profiles</h2>
          <p className="text-muted-foreground mb-6">
            We've run out of profiles to show you. Check back later or adjust your filters.
          </p>
          <Button onClick={onRefresh}>
            Refresh Profiles
          </Button>
        </AnimatedContainer>
      ) : !canSwipe ? (
        <AnimatedContainer
          animation="scale-in"
          className="text-center p-8 rounded-xl border border-border max-w-sm w-full"
        >
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Swipe limit reached</h2>
          <p className="text-muted-foreground mb-6">
            You've used all your free swipes for today. Upgrade to Premium for unlimited swipes and more features!
          </p>
          <Button onClick={onUpgrade} variant="default">
            <Crown className="w-4 h-4 mr-2" /> Upgrade to Premium
          </Button>
        </AnimatedContainer>
      ) : (
        currentProfile && (
          <ProfileCard
            profile={currentProfile}
            onLike={onLike}
            onDislike={onDislike}
            variant="swipe"
          />
        )
      )}
    </div>
  );
};

export default ProfileCardSection;
