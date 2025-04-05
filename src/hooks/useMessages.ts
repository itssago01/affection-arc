import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageType, ReactionType } from "@/components/messaging/MessageBubble";
import { uploadFileAttachment, uploadVoiceClip } from "@/lib/message-upload";
import { useToast } from "@/hooks/use-toast";

// Sample conversation data with corrected types
const sampleConversations: Record<string, Omit<Conversation, "id">> = {
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
const sampleMatchesList: Match[] = [
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

export type Match = {
  id: string;
  name: string;
  age: number;
  image: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export type Conversation = {
  id: string;
  name: string;
  age: number;
  image: string;
  messages: MessageType[];
  isTyping: boolean;
}

export const useMessages = (conversationId?: string) => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Record<string, Omit<Conversation, "id">>>(sampleConversations);
  const [matches, setMatches] = useState<Match[]>(sampleMatchesList);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<"file" | "image" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (conversationId && conversations[conversationId]) {
      setActiveConversation({
        id: conversationId,
        ...conversations[conversationId],
      });
    } else if (matches.length > 0 && !activeConversation) {
      navigate(`/messages/${matches[0].id}`);
    }
  }, [conversationId, conversations, matches, navigate, activeConversation]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !activeConversation) return;

    const message: MessageType = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setNewMessage("");

    if (selectedFile) {
      try {
        toast({
          description: "Uploading attachment..."
        });
        
        const userId = "current-user-id";
        const matchId = activeConversation.id;
        
        if (selectedFile.type.startsWith('image/')) {
          const result = await uploadFileAttachment(selectedFile, userId, matchId);
          
          if (result.success) {
            message.file_url = result.url;
            message.file_type = result.type;
          } else {
            toast({
              title: "Error",
              description: "Failed to upload image",
              variant: "destructive"
            });
          }
        } else {
          const result = await uploadFileAttachment(selectedFile, userId, matchId);
          
          if (result.success) {
            message.file_url = result.url;
            message.file_type = result.type;
          } else {
            toast({
              title: "Error",
              description: "Failed to upload file",
              variant: "destructive"
            });
          }
        }
        
        setSelectedFile(null);
        setAttachmentType(null);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error",
          description: "Failed to upload attachment",
          variant: "destructive"
        });
      }
    }

    setConversations({
      ...conversations,
      [activeConversation.id]: {
        ...conversations[activeConversation.id],
        messages: [...conversations[activeConversation.id].messages, message],
      },
    });

    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, message],
    });

    setTimeout(() => {
      updateMessageStatus(message.id, "delivered");
      
      if (Math.random() > 0.3) {
        simulateMatchTyping();
      }
    }, 1000);
  };

  const handleSendVoiceMessage = async (audioBlob: Blob, duration: number) => {
    if (!activeConversation) return;
    
    try {
      toast({
        description: "Uploading voice message..."
      });
      
      const userId = "current-user-id";
      const matchId = activeConversation.id;
      
      const result = await uploadVoiceClip(audioBlob, duration, userId, matchId);
      
      if (result.success) {
        const message: MessageType = {
          id: Date.now().toString(),
          content: "",
          sender: "user",
          timestamp: new Date(),
          status: "sent",
          voice_clip_url: result.url,
          voice_clip_duration: result.duration,
        };
        
        setConversations({
          ...conversations,
          [activeConversation.id]: {
            ...conversations[activeConversation.id],
            messages: [...conversations[activeConversation.id].messages, message],
          },
        });

        setActiveConversation({
          ...activeConversation,
          messages: [...activeConversation.messages, message],
        });
        
        setTimeout(() => {
          updateMessageStatus(message.id, "delivered");
          
          if (Math.random() > 0.3) {
            simulateMatchTyping();
          }
        }, 1000);
        
        setIsRecording(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to upload voice message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading voice message:", error);
      toast({
        title: "Error",
        description: "Failed to upload voice message",
        variant: "destructive"
      });
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setAttachmentType(file.type.startsWith('image/') ? 'image' : 'file');
  };

  const handleCancelAttachment = () => {
    setSelectedFile(null);
    setAttachmentType(null);
  };

  const updateMessageStatus = (messageId: string, status: "sent" | "delivered" | "read") => {
    if (!activeConversation) return;
    
    const updatedMessages = activeConversation.messages.map((msg: MessageType) => 
      msg.id === messageId ? { ...msg, status } : msg
    );
    
    setActiveConversation({
      ...activeConversation,
      messages: updatedMessages,
    });
    
    setConversations({
      ...conversations,
      [activeConversation.id]: {
        ...conversations[activeConversation.id],
        messages: updatedMessages,
      },
    });
  };

  const handleMessageReaction = (messageId: string, reaction: ReactionType) => {
    if (!activeConversation) return;
    
    const updatedMessages = activeConversation.messages.map((msg: MessageType) => 
      msg.id === messageId ? { ...msg, reaction } : msg
    );
    
    setActiveConversation({
      ...activeConversation,
      messages: updatedMessages,
    });
    
    setConversations({
      ...conversations,
      [activeConversation.id]: {
        ...conversations[activeConversation.id],
        messages: updatedMessages,
      },
    });

    if (reaction) {
      toast({
        description: `You reacted with ${reaction === "heart" ? "❤️" : reaction === "thumbsUp" ? "👍" : "😄"}`
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeConversation) return;
    
    const updatedMessages = activeConversation.messages.map((msg: MessageType) => 
      msg.id === messageId ? { ...msg, isDeleted: true } : msg
    );
    
    setActiveConversation({
      ...activeConversation,
      messages: updatedMessages,
    });
    
    setConversations({
      ...conversations,
      [activeConversation.id]: {
        ...conversations[activeConversation.id],
        messages: updatedMessages,
      },
    });
    
    toast({
      description: "Message deleted"
    });
  };

  const simulateMatchTyping = () => {
    if (!activeConversation) return;
    
    setConversations({
      ...conversations,
      [activeConversation.id]: {
        ...conversations[activeConversation.id],
        isTyping: true,
      },
    });
    
    setActiveConversation({
      ...activeConversation,
      isTyping: true,
    });
    
    const typingDuration = 1500 + Math.random() * 3000;
    
    setTimeout(() => {
      setConversations({
        ...conversations,
        [activeConversation.id]: {
          ...conversations[activeConversation.id],
          isTyping: false,
        },
      });
      
      setActiveConversation({
        ...activeConversation,
        isTyping: false,
      });
      
      const responseType = Math.random();
      
      let responseMessage: MessageType;
      
      if (responseType < 0.7) {
        const responseMessages = [
          "That sounds great! I'd love to hear more.",
          "Hmm, let me think about that...",
          "That's so interesting! Tell me more!",
          "I feel the same way!",
          "What else have you been up to lately?",
          "I hadn't thought about it that way before!",
        ];
        
        const responseIndex = Math.floor(Math.random() * responseMessages.length);
        responseMessage = {
          id: Date.now().toString(),
          content: responseMessages[responseIndex],
          sender: "match",
          timestamp: new Date(),
          status: "sent",
        };
      } else if (responseType < 0.85) {
        responseMessage = {
          id: Date.now().toString(),
          content: "",
          sender: "match",
          timestamp: new Date(),
          status: "sent",
          voice_clip_url: "https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3",
          voice_clip_duration: 6,
        };
      } else {
        responseMessage = {
          id: Date.now().toString(),
          content: "Check out this photo!",
          sender: "match",
          timestamp: new Date(),
          status: "sent",
          file_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
          file_type: "image/jpeg",
        };
      }
      
      const updatedConversation = {
        ...conversations[activeConversation.id],
        messages: [...conversations[activeConversation.id].messages, responseMessage],
      };
      
      setConversations({
        ...conversations,
        [activeConversation.id]: updatedConversation,
      });
      
      setActiveConversation({
        ...activeConversation,
        messages: [...activeConversation.messages, responseMessage],
        isTyping: false,
      });
      
      setTimeout(() => {
        const unreadUserMessages = activeConversation.messages
          .filter((msg: MessageType) => msg.sender === "user" && msg.status !== "read");
          
        if (unreadUserMessages.length > 0) {
          const updatedMessages = activeConversation.messages.map((msg: MessageType) => 
            msg.sender === "user" && msg.status !== "read" ? { ...msg, status: "read" } : msg
          );
          
          setActiveConversation({
            ...activeConversation,
            messages: updatedMessages,
          });
          
          setConversations({
            ...conversations,
            [activeConversation.id]: {
              ...conversations[activeConversation.id],
              messages: updatedMessages,
            },
          });
        }
      }, 1000);
      
    }, typingDuration);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    toast({
      description: "Voice recording canceled"
    });
  };

  const formatDate = (date: Date) => {
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

  return {
    newMessage,
    setNewMessage,
    activeConversation,
    matches,
    isRecording,
    selectedFile,
    attachmentType,
    handleSendMessage,
    handleSendVoiceMessage,
    handleFileSelected,
    handleCancelAttachment,
    handleMessageReaction,
    handleDeleteMessage,
    handleStartRecording,
    handleStopRecording,
    handleCancelRecording,
    formatDate,
  };
};
