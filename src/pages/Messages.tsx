import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import MessageBubble, { MessageType, ReactionType } from "@/components/messaging/MessageBubble";
import VoiceRecorder from "@/components/messaging/VoiceRecorder";
import FileAttachment from "@/components/messaging/FileAttachment";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { uploadFileAttachment, uploadVoiceClip } from "@/lib/message-upload";
import { supabase } from "@/integrations/supabase/client";

// Sample conversation data
const sampleConversations = {
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
const sampleMatchesList = [
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

const Messages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any>(sampleConversations);
  const [matches, setMatches] = useState(sampleMatchesList);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<"file" | "image" | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id && conversations[id]) {
      setActiveConversation({
        id,
        ...conversations[id],
      });
    } else if (matches.length > 0 && !activeConversation) {
      navigate(`/messages/${matches[0].id}`);
    }
  }, [id, conversations, matches, navigate, activeConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation]);

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

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto h-[calc(100vh-64px-80px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row">
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
                  className={`p-4 border-b border-border cursor-pointer transition-colors duration-200 ${match.id === id ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
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
        
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-border flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden mr-2"
                  onClick={() => navigate("/messages")}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={activeConversation.image} 
                    alt={activeConversation.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <h2 className="font-medium">{activeConversation.name}, {activeConversation.age}</h2>
                    {activeConversation.isTyping && (
                      <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                        typing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.messages.map((message: MessageType, index: number) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message}
                    onReaction={handleMessageReaction}
                    onDelete={handleDeleteMessage}
                  />
                ))}
                <div ref={messageEndRef} />
              </div>
              
              <div className="p-4 border-t border-border">
                {selectedFile ? (
                  <div className="flex items-center mb-2">
                    <FileAttachment 
                      onFileSelected={handleFileSelected}
                      onCancel={handleCancelAttachment}
                      isAttaching={!!selectedFile}
                      attachmentType={attachmentType}
                    />
                  </div>
                ) : isRecording ? (
                  <div className="flex items-center">
                    <VoiceRecorder 
                      isRecording={isRecording}
                      onStartRecording={handleStartRecording}
                      onStopRecording={handleStopRecording}
                      onCancelRecording={handleCancelRecording}
                      onSendRecording={handleSendVoiceMessage}
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FileAttachment 
                      onFileSelected={handleFileSelected}
                      onCancel={handleCancelAttachment}
                      isAttaching={false}
                      attachmentType={null}
                    />
                    
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 mx-2 rounded-full bg-muted/50 border border-border focus:ring-primary/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <VoiceRecorder 
                      isRecording={isRecording}
                      onStartRecording={handleStartRecording}
                      onStopRecording={handleStopRecording}
                      onCancelRecording={handleCancelRecording}
                      onSendRecording={handleSendVoiceMessage}
                    />
                    
                    <Button 
                      variant={newMessage.trim() ? "primary" : "ghost"}
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && !selectedFile}
                      icon={<Send className="w-5 h-5" />}
                    >
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">No conversation selected</h2>
                <p className="text-muted-foreground mb-4">
                  Select a conversation from the sidebar or start matching with new people
                </p>
                <Button 
                  onClick={() => navigate("/matches")}
                  icon={<Heart className="w-4 h-4" />}
                  iconPosition="left"
                >
                  View Matches
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
