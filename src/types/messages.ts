
import { ReactNode } from "react";

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

export type Match = {
  id: string;
  name: string;
  age: number;
  image: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  age: number;
  image: string;
  messages: MessageType[];
  isTyping: boolean;
};

export type DatingPreferences = {
  gender: "women" | "men" | "all";
  ageRange: [number, number];
  distance: number;
  lookingFor: "casual" | "serious" | "friendship" | "undecided";
};
