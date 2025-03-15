
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import MatchCard, { MatchData } from "@/components/matches/MatchCard";
import { useNavigate } from "react-router-dom";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";
import { ArrowLeft, Heart, Search } from "lucide-react";

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
];

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchData[]>(sampleMatches);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMatches = matches.filter(match => 
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessage = (id: string) => {
    navigate(`/messages/${id}`);
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Matches</h1>
          <div className="relative">
            <Search className="w-4 h-4 absolute top-2.5 left-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
            />
          </div>
        </div>
        
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMatches.map((match, index) => (
              <MatchCard
                key={match.id}
                match={match}
                onMessage={handleMessage}
                delay={index * 50}
              />
            ))}
          </div>
        ) : (
          <AnimatedContainer
            animation="fade-in"
            className="text-center p-8 rounded-xl border border-border"
          >
            {searchQuery ? (
              <>
                <h2 className="text-xl font-semibold mb-2">No matches found</h2>
                <p className="text-muted-foreground mb-4">
                  No matches found for "{searchQuery}". Try a different search.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Clear Search
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
      </main>
    </div>
  );
};

export default Matches;
