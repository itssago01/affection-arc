
import React from "react";
import { Check } from "lucide-react";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AnimatedContainer from "@/components/common/AnimatedContainer";

const Subscription = () => {
  const { currentTier, subscriptionPlans, upgradeTier } = useSubscription();
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionTier | null>(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleSubscribe = (tier: SubscriptionTier) => {
    setSelectedPlan(tier);
    setShowConfirmation(true);
  };

  const confirmSubscription = () => {
    if (selectedPlan) {
      upgradeTier(selectedPlan);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 pt-16">
      <Navbar />

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <AnimatedContainer animation="slide-down" className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Choose the perfect plan to enhance your dating experience
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {Object.values(subscriptionPlans).map((plan) => (
            <AnimatedContainer
              key={plan.tier}
              animation="scale-in"
              className={`rounded-xl border p-6 transition-all duration-300 ${
                currentTier === plan.tier
                  ? "border-primary bg-primary/5 relative"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {currentTier === plan.tier && (
                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-3 py-1 font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.interval && (
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={currentTier === plan.tier ? "outline" : "default"}
                onClick={() => handleSubscribe(plan.tier)}
                disabled={currentTier === plan.tier}
              >
                {currentTier === plan.tier
                  ? "Current Plan"
                  : plan.tier === "free"
                  ? "Downgrade"
                  : "Subscribe"}
              </Button>
            </AnimatedContainer>
          ))}
        </div>

        {/* Payment Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Subscription</DialogTitle>
              <DialogDescription>
                {selectedPlan === "free"
                  ? "Are you sure you want to downgrade to the Free plan? You'll lose access to premium features."
                  : `You're about to subscribe to the ${
                      selectedPlan ? subscriptionPlans[selectedPlan].name : ""
                    } plan for ${
                      selectedPlan ? subscriptionPlans[selectedPlan].price : ""
                    }/${
                      selectedPlan ? subscriptionPlans[selectedPlan].interval : ""
                    }.`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedPlan && selectedPlan !== "free" && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cardholder Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVC</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={confirmSubscription}>
                {selectedPlan === "free" ? "Confirm Downgrade" : "Confirm Payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Subscription;
