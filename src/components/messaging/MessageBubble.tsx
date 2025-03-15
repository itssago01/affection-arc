
import React from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import AnimatedContainer from "../common/AnimatedContainer";

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "match";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
};

type MessageBubbleProps = {
  message: MessageType;
  showTimestamp?: boolean;
  className?: string;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showTimestamp = true,
  className,
}) => {
  const isUserMessage = message.sender === "user";
  
  return (
    <AnimatedContainer
      animation="scale-in"
      className={cn(
        "flex",
        isUserMessage ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isUserMessage
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted text-foreground rounded-tl-none"
        )}
      >
        <p className="text-sm">{message.content}</p>
        {showTimestamp && (
          <div className="mt-1 flex items-center justify-end">
            <span
              className={cn(
                "text-[10px]",
                isUserMessage ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
};

export default MessageBubble;
