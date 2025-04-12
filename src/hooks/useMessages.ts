
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MessageType, ReactionType, Match, Conversation } from "@/types/messages";
import { uploadFileAttachment, uploadVoiceClip } from "@/lib/message-upload";
import { sampleConversations, sampleMatchesList } from "@/data/sampleConversations";
import { 
  createTextMessage, 
  createVoiceMessage,
  createImageMessage,
  formatDateRelative,
  updateMessageStatus,
  updateMessageReaction,
  markMessageAsDeleted,
  showToastForReaction,
  generateResponseMessages
} from "@/utils/messageUtils";

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
      updateMessageDeliveryStatus(message.id, "delivered");
      
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
        const message = createVoiceMessage(result.url, result.duration, "user");
        
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
          updateMessageDeliveryStatus(message.id, "delivered");
          
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

  const updateMessageDeliveryStatus = (messageId: string, status: "sent" | "delivered" | "read") => {
    if (!activeConversation) return;
    
    const updatedMessages = updateMessageStatus(activeConversation.messages, messageId, status);
    
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
    
    const updatedMessages = updateMessageReaction(activeConversation.messages, messageId, reaction);
    
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

    showToastForReaction(reaction);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeConversation) return;
    
    const updatedMessages = markMessageAsDeleted(activeConversation.messages, messageId);
    
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
        responseMessage = createTextMessage(generateResponseMessages(), "match");
      } else if (responseType < 0.85) {
        responseMessage = createVoiceMessage(
          "https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3", 
          6, 
          "match"
        );
      } else {
        responseMessage = createImageMessage(
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
          "Check out this photo!",
          "match"
        );
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
    return formatDateRelative(date);
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
