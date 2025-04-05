
import React from "react";
import { Heart, Activity, Zap, Trophy } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

type TrendType = "up" | "down" | "neutral";

interface ProfileStat {
  title: string;
  value: string;
  description: string;
  trend: TrendType;
  icon: React.ElementType;
  color: string;
}

interface ProfileStatisticsProps {
  stats?: ProfileStat[];
}

const defaultStats = [
  { 
    title: "Match Rate", 
    value: "78%", 
    description: "Above average for your area", 
    trend: "up" as TrendType, 
    icon: Heart, 
    color: "bg-gradient-to-r from-rose-500 to-pink-500" 
  },
  { 
    title: "Profile Views", 
    value: "342", 
    description: "Last 7 days", 
    trend: "up" as TrendType, 
    icon: Activity, 
    color: "bg-gradient-to-r from-blue-500 to-indigo-500" 
  },
  { 
    title: "Response Rate", 
    value: "92%", 
    description: "Top 10% of users", 
    trend: "up" as TrendType, 
    icon: Zap, 
    color: "bg-gradient-to-r from-amber-400 to-orange-500" 
  },
  { 
    title: "Compatibility", 
    value: "High", 
    description: "Based on your preferences", 
    trend: "neutral" as TrendType, 
    icon: Trophy, 
    color: "bg-gradient-to-r from-green-400 to-emerald-500" 
  }
];

const ProfileStatistics: React.FC<ProfileStatisticsProps> = ({
  stats = defaultStats
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Your Profile Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <AnimatedContainer
            key={stat.title}
            animation="scale-in"
            delay={index * 100}
            className="rounded-xl border border-border overflow-hidden"
          >
            <div className={`h-1.5 ${stat.color}`}></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color} text-white`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground pb-1">{stat.description}</span>
              </div>
              <div className="mt-2">
                {stat.trend === "up" && (
                  <span className="text-xs font-medium text-green-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Trending up
                  </span>
                )}
                {stat.trend === "down" && (
                  <span className="text-xs font-medium text-red-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Trending down
                  </span>
                )}
                {stat.trend === "neutral" && (
                  <span className="text-xs font-medium text-blue-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Stable
                  </span>
                )}
              </div>
            </div>
          </AnimatedContainer>
        ))}
      </div>
    </div>
  );
};

export default ProfileStatistics;
