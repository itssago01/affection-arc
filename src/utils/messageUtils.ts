
import { MessageType, ReactionType, Conversation } from "@/types/messages";
import { toast } from "@/hooks/use-toast";

export const generateResponseMessages = () => {
  const responseMessages = [
    "That sounds great! I'd love to hear more.",
    "Hmm, let me think about that...",
    "That's so interesting! Tell me more!",
    "I feel the same way!",
    "What else have you been up to lately?",
    "I hadn't thought about it that way before!",
  ];
  
  const responseIndex = Math.floor(Math.random() * responseMessages.length);
  return responseMessages[responseIndex];
};

export const createTextMessage = (content: string, sender: "user" | "match"): MessageType => {
  return {
    id: Date.now().toString(),
    content,
    sender,
    timestamp: new Date(),
    status: "sent",
  };
};

export const createVoiceMessage = (url: string, duration: number, sender: "user" | "match"): MessageType => {
  return {
    id: Date.now().toString(),
    content: "",
    sender,
    timestamp: new Date(),
    status: "sent",
    voice_clip_url: url,
    voice_clip_duration: duration,
  };
};

export const createImageMessage = (url: string, content: string, sender: "user" | "match"): MessageType => {
  return {
    id: Date.now().toString(),
    content,
    sender,
    timestamp: new Date(),
    status: "sent",
    file_url: url,
    file_type: "image/jpeg",
  };
};

export const formatDateRelative = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  
  if (diff < day) {
    return "Today";
  } else if (diff < 2 * day) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

export const updateMessageStatus = (
  messages: MessageType[], 
  messageId: string, 
  status: "sent" | "delivered" | "read"
) => {
  return messages.map(msg => 
    msg.id === messageId ? { ...msg, status } : msg
  );
};

export const updateMessageReaction = (
  messages: MessageType[], 
  messageId: string, 
  reaction: ReactionType
) => {
  return messages.map(msg => 
    msg.id === messageId ? { ...msg, reaction } : msg
  );
};

export const markMessageAsDeleted = (
  messages: MessageType[], 
  messageId: string
) => {
  return messages.map(msg => 
    msg.id === messageId ? { ...msg, isDeleted: true } : msg
  );
};

export const showToastForReaction = (reaction: ReactionType) => {
  if (reaction) {
    toast({
      description: `You reacted with ${reaction === "heart" ? "❤️" : reaction === "thumbsUp" ? "👍" : "😄"}`
    });
  }
};
