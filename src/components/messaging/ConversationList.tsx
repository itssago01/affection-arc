
import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Match } from "@/hooks/useMessages";

type ConversationListProps = {
  matches: Match[];
  activeId?: string;
  formatDate: (date: Date) => string;
};

const ConversationList: React.FC<ConversationListProps> = ({ 
  matches, 
  activeId,
  formatDate 
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-80 border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-64px)]">
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <AnimatedContainer
              key={match.id}
              animation="slide-up"
              delay={index * 50}
              className={`p-4 border-b border-border cursor-pointer transition-colors duration-200 ${match.id === activeId ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
              onClick={() => navigate(`/messages/${match.id}`)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={match.image} 
                      alt={match.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {match.unread && (
                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{match.name}, {match.age}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(match.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {match.lastMessage}
                  </p>
                </div>
              </div>
            </AnimatedContainer>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
