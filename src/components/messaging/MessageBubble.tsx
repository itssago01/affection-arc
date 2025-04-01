import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, ChevronDown, FileAudio, FileText, Heart, ThumbsUp, Smile, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";

// Ensure the types are strictly defined
export type ReactionType = "heart" | "thumbsUp" | "laugh" | null;

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "match";
  timestamp: Date;
  status: "read" | "sent" | "delivered";
  reaction?: ReactionType;
  isDeleted?: boolean;
  file_url?: string;
  file_type?: string;
  voice_clip_url?: string;
  voice_clip_duration?: number;
};

type MessageBubbleProps = {
  message: MessageType;
  onReaction: (messageId: string, reaction: ReactionType) => void;
  onDelete: (messageId: string) => void;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onReaction, onDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleReaction = (reaction: ReactionType) => {
    onReaction(message.id, reaction);
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    onDelete(message.id);
    setIsDropdownOpen(false);
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return null;

    if (fileType.startsWith("audio/")) {
      return <FileAudio className="w-4 h-4 mr-1" />;
    } else {
      return <FileText className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className={cn(
      "relative flex flex-col w-fit max-w-[75%] break-words rounded-xl px-3 py-2",
      message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-foreground mr-auto"
    )}>
      {message.isDeleted ? (
        <div className="italic text-muted-foreground">
          This message was deleted
        </div>
      ) : (
        <>
          {message.file_url ? (
            <div className="flex items-center">
              {getFileIcon(message.file_type)}
              <a 
                href={message.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                View File
              </a>
            </div>
          ) : message.voice_clip_url ? (
            <audio controls src={message.voice_clip_url}>
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>{message.content}</p>
          )}

          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="mr-2">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {message.sender === "user" && message.status === "read" && (
              <Check className="w-3 h-3 ml-1" />
            )}
          </div>
        </>
      )}

      {!message.isDeleted && (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
              <ChevronDown className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => handleReaction(message.reaction === "heart" ? null : "heart")}>
              <Heart className="w-4 h-4 mr-2" /> Heart
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReaction(message.reaction === "thumbsUp" ? null : "thumbsUp")}>
              <ThumbsUp className="w-4 h-4 mr-2" /> Thumbs Up
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReaction(message.reaction === "laugh" ? null : "laugh")}>
              <Smile className="w-4 h-4 mr-2" /> Laugh
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {message.reaction && (
        <div className="absolute -top-1 -left-1 bg-secondary rounded-full p-1">
          {message.reaction === "heart" && <Heart className="w-4 h-4 text-red-500" />}
          {message.reaction === "thumbsUp" && <ThumbsUp className="w-4 h-4 text-blue-500" />}
          {message.reaction === "laugh" && <Smile className="w-4 h-4 text-yellow-500" />}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
