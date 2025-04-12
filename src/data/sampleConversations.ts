
import { MessageType, Match, Conversation } from "@/types/messages";

// Sample conversation data with corrected types
export const sampleConversations: Record<string, Omit<Conversation, "id">> = {
  "1": {
    name: "Sophie",
    age: 27,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    messages: [
      {
        id: "1",
        content: "Hey there! I noticed we both like hiking. What's your favorite trail?",
        sender: "match",
        timestamp: new Date(Date.now() - 3600000 * 24),
        status: "read",
      },
      {
        id: "2",
        content: "Hi Sophie! I love hiking the Appalachian Trail. Have you been there?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 23),
        status: "read",
      },
      {
        id: "3",
        content: "Yes! I did a section of it last summer. It was beautiful. We should go sometime!",
        sender: "match",
        timestamp: new Date(Date.now() - 3600000 * 22),
        status: "read",
        reaction: "heart",
      },
      {
        id: "4",
        content: "That sounds great! I'd love to. When are you usually free?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 2),
        status: "read",
      }
    ],
    isTyping: false,
  },
  "2": {
    name: "Alex",
    age: 29,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    messages: [
      {
        id: "1",
        content: "I saw you like playing guitar too! What kind of music do you play?",
        sender: "match",
        timestamp: new Date(Date.now() - 3600000 * 50),
        status: "read",
      },
      {
        id: "2",
        content: "Hey Alex! I'm into indie and folk mostly. You?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 49),
        status: "read",
      },
      {
        id: "3",
        content: "Same here! Have you heard the new Bon Iver album?",
        sender: "match",
        timestamp: new Date(Date.now() - 3600000 * 48),
        status: "read",
      }
    ],
    isTyping: false,
  },
};

// Sample matches list
export const sampleMatchesList: Match[] = [
  {
    id: "1",
    name: "Sophie",
    age: 27,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    lastMessage: "That sounds great! I'd love to. When are you usually free?",
    timestamp: new Date(Date.now() - 3600000 * 2),
    unread: true,
  },
  {
    id: "2",
    name: "Alex",
    age: 29,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    lastMessage: "Same here! Have you heard the new Bon Iver album?",
    timestamp: new Date(Date.now() - 3600000 * 48),
    unread: false,
  },
  {
    id: "3",
    name: "Emma",
    age: 26,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    lastMessage: "I love that movie too! We should watch it together sometime.",
    timestamp: new Date(Date.now() - 3600000 * 72),
    unread: false,
  },
];
