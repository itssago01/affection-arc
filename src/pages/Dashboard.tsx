import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { ProfileData } from "@/components/profile/ProfileCard";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Import refactored components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TabNavigation from "@/components/dashboard/TabNavigation";
import DashboardStats from "@/components/dashboard/DashboardStats";
import FilterPanel from "@/components/dashboard/FilterPanel";
import CitySpotlight from "@/components/dashboard/CitySpotlight";
import ProfileCardSection from "@/components/dashboard/ProfileCardSection";
import ProfileStatistics from "@/components/dashboard/ProfileStatistics";
import PremiumFeatures from "@/components/dashboard/PremiumFeatures";

// Sample profiles data with more detailed information
const sampleProfiles: ProfileData[] = [
  {
    id: "1",
    name: "Sophie",
    age: 27,
    location: "New York",
    bio: "Art lover, coffee enthusiast, and weekend hiker. Looking for someone to share adventures and quiet moments alike. I'm passionate about photography and exploring hidden gems in the city.",
    interests: ["Art", "Coffee", "Hiking", "Photography", "Travel", "Reading", "Jazz"],
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    ],
    distance: "2 miles away",
  },
  {
    id: "2",
    name: "Alex",
    age: 29,
    location: "Brooklyn",
    bio: "Musician and foodie with a passion for discovering new restaurants. When I'm not playing guitar, I'm trying new recipes at home. Looking for someone who enjoys live music and culinary adventures.",
    interests: ["Music", "Food", "Cooking", "Concerts", "Photography", "Craft Beer", "Vinyl Records"],
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    ],
    distance: "5 miles away",
  },
  {
    id: "3",
    name: "Emma",
    age: 26,
    location: "Manhattan",
    bio: "Tech professional by day, dancer by night. Looking for someone who appreciates both logical and creative pursuits. I love visiting art galleries, taking dance classes, and finding the best brunch spots in town.",
    interests: ["Dancing", "Technology", "Movies", "Yoga", "Brunch", "Art Galleries", "Theater"],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    ],
    distance: "3 miles away",
  },
  {
    id: "4",
    name: "Michael",
    age: 31,
    location: "Queens",
    bio: "Passionate about fitness, outdoor adventures, and trying new cuisines. Training for my third marathon while also exploring the best ramen spots around the city. Looking for someone with similar active interests.",
    interests: ["Fitness", "Running", "Hiking", "Food", "Travel", "Photography", "Cooking"],
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    ],
    distance: "7 miles away",
  },
];

const Dashboard = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([...sampleProfiles]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [noMoreProfiles, setNoMoreProfiles] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'nearby' | 'popular'>('discover');
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
        {/* Dashboard Header */}
        <DashboardHeader 
          isSubscribed={isSubscribed}
          remainingSwipes={remainingSwipes}
          toggleFilters={toggleFilters}
          goToSubscription={goToSubscription}
        />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Dashboard Stats */}
        <DashboardStats />
        
        {/* Filter Panel */}
        <FilterPanel showFilters={showFilters} />
        
        {/* City Spotlight */}
        <CitySpotlight />
        
        {/* Profile Card Section */}
        <ProfileCardSection 
          currentProfile={currentProfile}
          noMoreProfiles={noMoreProfiles}
          canSwipe={canSwipe}
          onLike={handleLike}
          onDislike={handleDislike}
          onRefresh={resetProfiles}
          onUpgrade={goToSubscription}
        />

        {/* Profile Statistics Section */}
        <ProfileStatistics />

        {/* Premium Features Showcase */}
        <PremiumFeatures />
      </main>
    </div>
  );
};

export default Dashboard;
