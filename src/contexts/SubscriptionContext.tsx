
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionTier = "free" | "weekly" | "monthly";

export type SubscriptionPlan = {
  tier: SubscriptionTier;
  name: string;
  price: string;
  interval: string;
  features: string[];
  swipeLimit: number;
};

interface SubscriptionContextType {
  currentTier: SubscriptionTier;
  subscriptionPlans: Record<SubscriptionTier, SubscriptionPlan>;
  remainingSwipes: number;
  decrementSwipes: () => void;
  resetSwipes: () => void;
  upgradeTier: (tier: SubscriptionTier) => void;
  isSubscribed: boolean;
  lastSwipeReset: Date;
}

const subscriptionPlans: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    tier: "free",
    name: "Free",
    price: "$0",
    interval: "",
    features: ["10 swipes per day", "Basic matching", "Limited messaging"],
    swipeLimit: 10,
  },
  weekly: {
    tier: "weekly",
    name: "Premium Weekly",
    price: "$4.99",
    interval: "week",
    features: [
      "Unlimited swipes",
      "Priority matching",
      "See who likes you",
      "Advanced filters",
      "Unlimited messaging",
    ],
    swipeLimit: Infinity,
  },
  monthly: {
    tier: "monthly",
    name: "Premium Monthly",
    price: "$14.99",
    interval: "month",
    features: [
      "Unlimited swipes",
      "Priority matching",
      "See who likes you",
      "Advanced filters",
      "Unlimited messaging",
      "Profile boosts",
      "Discounted rate",
    ],
    swipeLimit: Infinity,
  },
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(() => {
    const savedTier = localStorage.getItem("subscriptionTier");
    return (savedTier as SubscriptionTier) || "free";
  });

  const [remainingSwipes, setRemainingSwipes] = useState<number>(() => {
    const savedSwipes = localStorage.getItem("remainingSwipes");
    return savedSwipes ? parseInt(savedSwipes, 10) : subscriptionPlans.free.swipeLimit;
  });

  const [lastSwipeReset, setLastSwipeReset] = useState<Date>(() => {
    const savedLastReset = localStorage.getItem("lastSwipeReset");
    return savedLastReset ? new Date(savedLastReset) : new Date();
  });

  const { toast } = useToast();
  
  useEffect(() => {
    localStorage.setItem("subscriptionTier", currentTier);
  }, [currentTier]);
  
  useEffect(() => {
    localStorage.setItem("remainingSwipes", remainingSwipes.toString());
  }, [remainingSwipes]);

  useEffect(() => {
    localStorage.setItem("lastSwipeReset", lastSwipeReset.toISOString());
  }, [lastSwipeReset]);

  // Check if a week has passed since the last reset
  useEffect(() => {
    const checkAndResetSwipes = () => {
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (now.getTime() - lastSwipeReset.getTime() >= oneWeek) {
        resetSwipes();
        setLastSwipeReset(now);
        
        if (currentTier === "free") {
          toast({
            title: "Swipes Refreshed!",
            description: "Your free swipes have been reset for the week.",
            variant: "default",
          });
        }
      }
    };
    
    // Check on initial load
    checkAndResetSwipes();
    
    // Set up a daily check
    const interval = setInterval(checkAndResetSwipes, 24 * 60 * 60 * 1000); // Check once per day
    
    return () => clearInterval(interval);
  }, [lastSwipeReset, currentTier, toast]);

  const decrementSwipes = () => {
    if (currentTier !== "free") return;
    
    if (remainingSwipes > 0) {
      setRemainingSwipes(prev => prev - 1);
    }
    
    if (remainingSwipes === 1) {
      toast({
        title: "Swipe limit reached",
        description: "You've used all your free swipes for today. Upgrade to Premium for unlimited swipes!",
        variant: "destructive",
      });
    } else if (remainingSwipes <= 3) {
      toast({
        title: `${remainingSwipes - 1} swipes remaining`,
        description: "Consider upgrading to Premium for unlimited swipes!",
        variant: "default",
      });
    }
  };

  const resetSwipes = () => {
    if (currentTier === "free") {
      setRemainingSwipes(subscriptionPlans.free.swipeLimit);
      setLastSwipeReset(new Date());
    }
  };

  const upgradeTier = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    
    if (tier !== "free") {
      toast({
        title: "Subscription Activated!",
        description: `You're now on the ${subscriptionPlans[tier].name} plan. Enjoy your benefits!`,
        variant: "default",
      });
    }
  };

  const isSubscribed = currentTier !== "free";

  return (
    <SubscriptionContext.Provider
      value={{
        currentTier,
        subscriptionPlans,
        remainingSwipes,
        decrementSwipes,
        resetSwipes,
        upgradeTier,
        isSubscribed,
        lastSwipeReset,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
