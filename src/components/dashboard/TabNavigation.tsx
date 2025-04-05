
import React from "react";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: 'discover' | 'nearby' | 'popular';
  setActiveTab: (tab: 'discover' | 'nearby' | 'popular') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default TabNavigation;
