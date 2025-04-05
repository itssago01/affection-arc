
import React from "react";
import { Heart, Map, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PremiumFeature {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

interface PremiumFeaturesProps {
  features?: PremiumFeature[];
}

const defaultFeatures = [
  {
    title: "Unlimited Likes",
    description: "Send as many likes as you want and increase your chances of finding a match.",
    icon: Heart,
    color: "bg-pink-100 text-pink-500",
    gradient: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    title: "Global Search",
    description: "Connect with people anywhere in the world, not just in your local area.",
    icon: Map,
    color: "bg-blue-100 text-blue-500",
    gradient: "bg-gradient-to-r from-blue-500 to-violet-500",
  },
  {
    title: "Priority Matches",
    description: "Get shown to more potential matches and increase your visibility.",
    icon: Coffee,
    color: "bg-amber-100 text-amber-500",
    gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
];

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({
  features = defaultFeatures
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Premium Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card 
            key={feature.title}
            className="overflow-hidden border border-border bg-card/50 hover:bg-card/80 transition-colors"
          >
            <div className={`h-2 ${feature.gradient}`}></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <h3 className="font-medium">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PremiumFeatures;
