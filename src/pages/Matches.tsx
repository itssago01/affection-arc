
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import MatchCard, { MatchData } from "@/components/matches/MatchCard";
import { useNavigate } from "react-router-dom";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";
import { ArrowLeft, Heart, Search, Clock, Filter, UserPlus, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// Sample matches data
const sampleMatches: MatchData[] = [
  {
    id: "1",
    name: "Sophie",
    age: 27,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    matchDate: "Today",
    lastActive: "2 hours ago",
    hasUnreadMessage: true,
  },
  {
    id: "2",
    name: "Alex",
    age: 29,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    matchDate: "Yesterday",
    lastActive: "5 hours ago",
  },
  {
    id: "3",
    name: "Emma",
    age: 26,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    matchDate: "3 days ago",
    lastActive: "1 day ago",
  },
  {
    id: "4",
    name: "James",
    age: 28,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    matchDate: "1 week ago",
    lastActive: "2 days ago",
    hasUnreadMessage: true,
  },
  {
    id: "5",
    name: "Olivia",
    age: 25,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    matchDate: "2 weeks ago",
    lastActive: "3 days ago",
  },
  {
    id: "6",
    name: "Michael",
    age: 31,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    matchDate: "3 weeks ago",
    lastActive: "1 week ago",
  },
  {
    id: "7",
    name: "Jessica",
    age: 28,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    matchDate: "1 month ago",
    lastActive: "3 days ago",
  },
];

// Sample connection requests
const sampleRequests = [
  {
    id: "req1",
    name: "Taylor",
    age: 26,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    requestDate: "Today",
  },
  {
    id: "req2",
    name: "Jordan",
    age: 30,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
    requestDate: "Yesterday",
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchData[]>(sampleMatches);
  const [requests, setRequests] = useState(sampleRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "recent" | "unread">("all");

  const filteredMatches = matches.filter(match => {
    // Apply name search filter
    const nameMatch = match.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    if (filterBy === "recent") {
      return nameMatch && (match.matchDate === "Today" || match.matchDate === "Yesterday");
    } else if (filterBy === "unread") {
      return nameMatch && match.hasUnreadMessage;
    }
    
    return nameMatch;
  });

  const handleMessage = (id: string) => {
    navigate(`/messages/${id}`);
  };

  const handleAcceptRequest = (id: string) => {
    // Find the request
    const request = requests.find(req => req.id === id);
    
    if (request) {
      // Add to matches
      const newMatch: MatchData = {
        id: request.id,
        name: request.name,
        age: request.age,
        image: request.image,
        matchDate: "Just now",
        lastActive: "Just now",
      };
      
      setMatches(prev => [newMatch, ...prev]);
      
      // Remove from requests
      setRequests(prev => prev.filter(req => req.id !== id));
      
      // Show toast notification
      toast.success(`You matched with ${request.name}!`);
    }
  };

  const handleDeclineRequest = (id: string) => {
    // Remove from requests
    setRequests(prev => prev.filter(req => req.id !== id));
    toast.info("Connection request declined");
  };

  const handleUnmatch = (id: string) => {
    // Show confirmation
    if (window.confirm("Are you sure you want to unmatch? This cannot be undone.")) {
      setMatches(prev => prev.filter(match => match.id !== id));
      toast.success("Unmatched successfully");
    }
  };

  const handleFilterChange = (value: "all" | "recent" | "unread") => {
    setFilterBy(value);
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="matches" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Your Connections</h1>
            <TabsList className="rounded-full">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="requests">
                Requests 
                {requests.length > 0 && (
                  <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                    {requests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="matches" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute top-2.5 left-3 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search matches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-full w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Button 
                  variant={filterBy === "all" ? "primary" : "outline"}
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleFilterChange("all")}
                >
                  All
                </Button>
                <Button 
                  variant={filterBy === "recent" ? "primary" : "outline"}
                  size="sm"
                  className="flex-1 sm:flex-none"
                  icon={<Clock className="w-4 h-4" />}
                  onClick={() => handleFilterChange("recent")}
                >
                  Recent
                </Button>
                <Button 
                  variant={filterBy === "unread" ? "primary" : "outline"}
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleFilterChange("unread")}
                >
                  Unread
                </Button>
              </div>
            </div>
            
            {filteredMatches.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMatches.map((match, index) => (
                  <div key={match.id} className="relative group">
                    <MatchCard
                      match={match}
                      onMessage={handleMessage}
                      delay={index * 50}
                    />
                    <button 
                      className="absolute top-2 left-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleUnmatch(match.id)}
                      title="Unmatch"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatedContainer
                animation="fade-in"
                className="text-center p-8 rounded-xl border border-border"
              >
                {searchQuery || filterBy !== "all" ? (
                  <>
                    <h2 className="text-xl font-semibold mb-2">No matches found</h2>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? `No matches found for "${searchQuery}".` : "No matches match the current filter."} Try different search criteria.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setFilterBy("all");
                      }}
                      icon={<ArrowLeft className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Clear Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Start discovering people and get your first match!
                    </p>
                    <Button 
                      onClick={() => navigate("/dashboard")}
                      icon={<Heart className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Discover People
                    </Button>
                  </>
                )}
              </AnimatedContainer>
            )}
          </TabsContent>

          <TabsContent value="requests">
            {requests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((request, index) => (
                  <AnimatedContainer
                    key={request.id}
                    animation="slide-up"
                    delay={index * 100}
                    className="bg-card p-4 rounded-xl border border-border flex items-center gap-4"
                  >
                    <img 
                      src={request.image} 
                      alt={request.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{request.name}, {request.age}</h3>
                      <p className="text-sm text-muted-foreground">Sent request {request.requestDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-destructive border-destructive"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </AnimatedContainer>
                ))}
              </div>
            ) : (
              <AnimatedContainer
                animation="fade-in"
                className="text-center p-8 rounded-xl border border-border"
              >
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">No pending requests</h2>
                <p className="text-muted-foreground mb-6">
                  You'll see connection requests here when someone is interested in you
                </p>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  icon={<Heart className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Discover More People
                </Button>
              </AnimatedContainer>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Matches;
