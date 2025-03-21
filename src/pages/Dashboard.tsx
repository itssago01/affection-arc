import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ProfileCard, { ProfileData } from "@/components/profile/ProfileCard";
import { Button } from "@/components/common/Button";
import { Filter, Heart, Crown } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Sample profiles data
const sampleProfiles: ProfileData[] = [
  {
    id: "1",
    name: "Sophie",
    age: 27,
    location: "New York",
    bio: "Art lover, coffee enthusiast, and weekend hiker. Looking for someone to share adventures and quiet moments alike.",
    interests: ["Art", "Coffee", "Hiking", "Reading", "Travel"],
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    ],
    distance: "2 miles away",
  },
  {
    id: "2",
    name: "Alex",
    age: 29,
    location: "Brooklyn",
    bio: "Musician and foodie with a passion for discovering new restaurants. When I'm not playing guitar, I'm trying new recipes at home.",
    interests: ["Music", "Food", "Cooking", "Concerts", "Photography"],
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    ],
    distance: "5 miles away",
  },
  {
    id: "3",
    name: "Emma",
    age: 26,
    location: "Manhattan",
    bio: "Tech professional by day, dancer by night. Looking for someone who appreciates both logical and creative pursuits.",
    interests: ["Dancing", "Technology", "Movies", "Yoga", "Brunch"],
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    ],
    distance: "3 miles away",
  },
];

const Dashboard = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([...sampleProfiles]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    currentTier, 
    remainingSwipes, 
    decrementSwipes, 
    isSubscribed 
  } = useSubscription();

  const currentProfile = profiles[currentProfileIndex];

  useEffect(() => {
    // Check if we've run out of profiles
    if (currentProfileIndex >= profiles.length) {
      setNoMoreProfiles(true);
    } else {
      setNoMoreProfiles(false);
    }
  }, [currentProfileIndex, profiles.length]);

  const handleLike = (id: string) => {
    // Decrement swipes if user is on free tier
    decrementSwipes();
    
    toast({
      title: "Liked!",
      description: `You liked ${currentProfile.name}`,
      variant: "default",
    });
    
    // Move to next profile
    setCurrentProfileIndex(currentProfileIndex + 1);
  };

  const handleDislike = (id: string) => {
    // Decrement swipes if user is on free tier
    decrementSwipes();
    
    // Move to next profile
    setCurrentProfileIndex(currentProfileIndex + 1);
  };

  const resetProfiles = () => {
    // In a real app, you would fetch new profiles here
    setProfiles([...sampleProfiles]);
    setCurrentProfileIndex(0);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const goToSubscription = () => {
    navigate('/subscription');
  };

  // Check if the user has used all their swipes
  const canSwipe = isSubscribed || remainingSwipes > 0;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Discover</h1>
          <div className="flex items-center gap-2">
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
        
        {/* Filter panel */}
        {showFilters && (
          <AnimatedContainer
            animation="slide-down"
            className="mb-6 p-4 rounded-xl border border-border bg-background shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Distance</label>
                <select className="w-full p-2 rounded-lg border border-border bg-background">
                  <option>5 miles</option>
                  <option>10 miles</option>
                  <option>25 miles</option>
                  <option>50 miles</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Age Range</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    className="w-20 p-2 rounded-lg border border-border bg-background" 
                    placeholder="Min"
                    defaultValue={18}
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    className="w-20 p-2 rounded-lg border border-border bg-background" 
                    placeholder="Max"
                    defaultValue={45}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Interests</label>
                <select className="w-full p-2 rounded-lg border border-border bg-background">
                  <option>All Interests</option>
                  <option>Art</option>
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Travel</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button size="sm">Apply Filters</Button>
            </div>
          </AnimatedContainer>
        )}
        
        {/* Profile cards */}
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
              <Button onClick={resetProfiles}>
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
              <Button onClick={goToSubscription} variant="default">
                <Crown className="w-4 h-4 mr-2" /> Upgrade to Premium
              </Button>
            </AnimatedContainer>
          ) : (
            currentProfile && (
              <ProfileCard
                profile={currentProfile}
                onLike={handleLike}
                onDislike={handleDislike}
                variant="swipe"
              />
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
