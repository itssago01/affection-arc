
import React from "react";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { Button } from "../common/Button";
import AnimatedContainer from "../common/AnimatedContainer";

export type MatchData = {
  id: string;
  name: string;
  age: number;
  image: string;
  matchDate: string;
  lastActive: string;
  hasUnreadMessage?: boolean;
};

type MatchCardProps = {
  match: MatchData;
  onMessage: (id: string) => void;
  className?: string;
  delay?: number;
};

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onMessage,
  className,
  delay = 0,
}) => {
  const handleMessage = () => {
    onMessage(match.id);
  };

  return (
    <AnimatedContainer
      animation="slide-up"
      delay={delay}
      className={cn(
        "relative rounded-xl overflow-hidden hover-card-effect",
        className
      )}
    >
      <div className="aspect-[3/4] relative">
        <img
          src={match.image}
          alt={match.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
        
        {/* Unread message indicator */}
        {match.hasUnreadMessage && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary animate-pulse-subtle" />
        )}
        
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-medium text-base">{match.name}, {match.age}</h3>
          <p className="text-xs text-white/80">Matched {match.matchDate}</p>
        </div>
        
        {/* Message button */}
        <Button
          variant="glass"
          size="icon"
          className="absolute bottom-3 right-3 bg-white/80 text-foreground hover:bg-white"
          onClick={handleMessage}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>
    </AnimatedContainer>
  );
};

export default MatchCard;
