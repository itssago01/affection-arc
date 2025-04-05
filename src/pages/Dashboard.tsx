
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ProfileCard, { ProfileData } from "@/components/profile/ProfileCard";
import { Button } from "@/components/common/Button";
import { Filter, Heart, Crown, Compass, Map, Users, Coffee, MapPin } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardContent } from "@/components/ui/card";

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

  // Stats for the dashboard
  const stats = [
    { label: "Active Users", value: "2,438", icon: Users, color: "bg-blue-500" },
    { label: "Matches Today", value: "186", icon: Heart, color: "bg-rose-500" },
    { label: "Local Events", value: "12", icon: Compass, color: "bg-amber-500" },
    { label: "Nearby Hotspots", value: "24", icon: Coffee, color: "bg-emerald-500" },
  ];

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

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-border">
          <button
            className={`pb-2 px-4 font-medium text-sm relative ${activeTab === 'discover' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
            {activeTab === 'discover' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            className={`pb-2 px-4 font-medium text-sm relative ${activeTab === 'nearby' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('nearby')}
          >
            Nearby
            {activeTab === 'nearby' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            className={`pb-2 px-4 font-medium text-sm relative ${activeTab === 'popular' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('popular')}
          >
            Popular
            {activeTab === 'popular' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>
        
        {/* Dashboard Stats - Show on top for context */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <AnimatedContainer
              key={stat.label}
              animation="scale-in"
              delay={index * 100}
              className="rounded-xl border border-border p-4 bg-card"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="text-xl font-semibold">{stat.value}</span>
                </div>
              </div>
            </AnimatedContainer>
          ))}
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
        
        {/* City Spotlight - New Section */}
        <AnimatedContainer 
          animation="fade-in"
          className="mb-6 p-4 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-primary/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">City Spotlight: New York</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Find the perfect match in the Big Apple! New York is buzzing with singles ready to connect.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-sm">
              <span className="inline-flex items-center text-muted-foreground">
                <Users className="w-4 h-4 mr-1" /> 8,542 Active
              </span>
              <span className="inline-flex items-center text-muted-foreground">
                <Heart className="w-4 h-4 mr-1" /> 423 Matches Today
              </span>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Explore City
            </Button>
          </div>
        </AnimatedContainer>
        
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

        {/* Premium Features Showcase - New Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Premium Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="overflow-hidden border border-border bg-card/50 hover:bg-card/80 transition-colors">
              <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium">Unlimited Likes</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Send as many likes as you want and increase your chances of finding a match.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border border-border bg-card/50 hover:bg-card/80 transition-colors">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-violet-500"></div>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <Map className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium">Global Search</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect with people anywhere in the world, not just in your local area.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border border-border bg-card/50 hover:bg-card/80 transition-colors">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium">Priority Matches</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get shown to more potential matches and increase your visibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
