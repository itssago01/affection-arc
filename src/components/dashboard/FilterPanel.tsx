
import React from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";

interface FilterPanelProps {
  showFilters: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ showFilters }) => {
  if (!showFilters) return null;

  return (
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
  );
};

export default FilterPanel;
