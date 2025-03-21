
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

  const { toast } = useToast();
  
  useEffect(() => {
    localStorage.setItem("subscriptionTier", currentTier);
  }, [currentTier]);
  
  useEffect(() => {
    localStorage.setItem("remainingSwipes", remainingSwipes.toString());
  }, [remainingSwipes]);

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
