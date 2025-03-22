
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import AnimatedContainer from "../common/AnimatedContainer";
import { Check, CheckCheck, Heart, Laugh, ThumbsUp, Trash, X } from "lucide-react";
import { Button } from "../common/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ReactionType = "heart" | "thumbsUp" | "laugh" | null;

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "match";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
  reaction?: ReactionType;
  isDeleted?: boolean;
};

type MessageBubbleProps = {
  message: MessageType;
  showTimestamp?: boolean;
  className?: string;
  onReaction?: (messageId: string, reaction: ReactionType) => void;
  onDelete?: (messageId: string) => void;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showTimestamp = true,
  className,
  onReaction,
  onDelete,
}) => {
  const isUserMessage = message.sender === "user";
  const [showReactions, setShowReactions] = useState(false);
  
  // Status icon mapping
  const statusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  // Reaction icon mapping
  const reactionIcon = () => {
    switch (message.reaction) {
      case "heart":
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case "thumbsUp":
        return <ThumbsUp className="w-4 h-4 text-blue-500 fill-blue-500" />;
      case "laugh":
        return <Laugh className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      default:
        return null;
    }
  };

  // Toggle reaction panel
  const toggleReactions = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowReactions(!showReactions);
  };

  // Handle reaction selection
  const handleReaction = (reaction: ReactionType) => {
    if (onReaction) {
      onReaction(message.id, reaction);
      setShowReactions(false);
    }
  };

  // Handle message deletion
  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

  return (
    <AnimatedContainer
      animation="scale-in"
      className={cn(
        "flex flex-col",
        isUserMessage ? "items-end" : "items-start",
        className
      )}
    >
      <div className="relative group">
        {/* Message bubble */}
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-2 mb-1",
            message.isDeleted 
              ? "bg-muted/30 italic text-muted-foreground" 
              : isUserMessage
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-muted text-foreground rounded-tl-none"
          )}
          onDoubleClick={toggleReactions}
        >
          {message.isDeleted ? (
            <p className="text-sm">This message was deleted</p>
          ) : (
            <>
              <p className="text-sm">{message.content}</p>
              {showTimestamp && (
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span
                    className={cn(
                      "text-[10px]",
                      isUserMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                  {isUserMessage && statusIcon()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Reaction display */}
        {message.reaction && !message.isDeleted && (
          <div 
            className={cn(
              "absolute bottom-0 transform translate-y-1/2", 
              isUserMessage ? "right-2" : "left-2"
            )}
          >
            <div className="bg-background border border-border rounded-full p-1 shadow-sm">
              {reactionIcon()}
            </div>
          </div>
        )}

        {/* Reaction options panel */}
        {showReactions && !message.isDeleted && (
          <div className="absolute bottom-full mb-2 bg-background border border-border rounded-full p-1 shadow-md flex items-center space-x-1">
            <button 
              onClick={() => handleReaction("heart")}
              className="p-1 hover:bg-muted rounded-full"
            >
              <Heart className={cn("w-4 h-4", message.reaction === "heart" ? "fill-red-500 text-red-500" : "")} />
            </button>
            <button 
              onClick={() => handleReaction("thumbsUp")}
              className="p-1 hover:bg-muted rounded-full"
            >
              <ThumbsUp className={cn("w-4 h-4", message.reaction === "thumbsUp" ? "fill-blue-500 text-blue-500" : "")} />
            </button>
            <button 
              onClick={() => handleReaction("laugh")}
              className="p-1 hover:bg-muted rounded-full"
            >
              <Laugh className={cn("w-4 h-4", message.reaction === "laugh" ? "fill-yellow-500 text-yellow-500" : "")} />
            </button>
            {message.reaction && (
              <button 
                onClick={() => handleReaction(null)}
                className="p-1 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Delete option (only for user messages) */}
        {isUserMessage && !message.isDeleted && (
          <div className="absolute left-0 top-0 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Delete message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default MessageBubble;
