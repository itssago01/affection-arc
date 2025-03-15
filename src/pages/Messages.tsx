
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import MessageBubble, { MessageType } from "@/components/messaging/MessageBubble";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";
import { ArrowLeft, Heart, Image, Send } from "lucide-react";

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
      },
      {
        id: "2",
        content: "Hi Sophie! I love hiking the Appalachian Trail. Have you been there?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 23),
      },
      {
        id: "3",
        content: "Yes! I did a section of it last summer. It was beautiful. We should go sometime!",
        sender: "match",
        timestamp: new Date(Date.now() - 3600000 * 22),
      },
      {
        id: "4",
        content: "That sounds great! I'd love to. When are you usually free?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 2),
      }
    ],
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
      },
      {
        id: "2",
        content: "Hey Alex! I'm into indie and folk mostly. You?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 49),
      },
      {
        id: "3",
        content: "Same here! Have you heard the new Bon Iver album?",
        sender: "match",
        timestamp: new Date(Date.now() - 3600000 * 48),
      }
    ],
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
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Set active conversation based on route param
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

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: MessageType = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    // Update conversations state
    setConversations({
      ...conversations,
      [activeConversation.id]: {
        ...conversations[activeConversation.id],
        messages: [...conversations[activeConversation.id].messages, message],
      },
    });

    // Update active conversation
    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, message],
    });

    // Clear input
    setNewMessage("");
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
        {/* Matches/Conversations sidebar */}
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
        
        {/* Message content */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Conversation header */}
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
                <div className="ml-3">
                  <h2 className="font-medium">{activeConversation.name}, {activeConversation.age}</h2>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConversation.messages.map((message: MessageType, index: number) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                  />
                ))}
                <div ref={messageEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Image className="w-5 h-5" />
                  </Button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 mx-2 py-2 px-4 rounded-full bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    variant={newMessage.trim() ? "primary" : "ghost"}
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
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
