
import React from "react";
import { Users, Heart, Compass, Coffee } from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";

type StatItem = {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
};

interface DashboardStatsProps {
  stats?: StatItem[];
}

const defaultStats = [
  { label: "Active Users", value: "2,438", icon: Users, color: "bg-blue-500" },
  { label: "Matches Today", value: "186", icon: Heart, color: "bg-rose-500" },
  { label: "Local Events", value: "12", icon: Compass, color: "bg-amber-500" },
  { label: "Nearby Hotspots", value: "24", icon: Coffee, color: "bg-emerald-500" },
];

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  stats = defaultStats 
}) => {
  return (
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
  );
};

export default DashboardStats;
