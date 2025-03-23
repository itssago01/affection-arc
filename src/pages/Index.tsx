
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";
import { Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth#signup");
    }
  };

  const handleTryDemo = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center px-6 py-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/10 animate-float" style={{ animationDelay: "0.2s" }} />
        <div className="absolute bottom-40 left-10 w-40 h-40 rounded-full bg-secondary/10 animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-accent/10 animate-float" style={{ animationDelay: "0.8s" }} />
        
        <div className="container max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <AnimatedContainer animation="slide-up" delay={100}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                  Find your perfect match with <span className="text-primary">love</span>Spark
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200}>
                <p className="text-lg text-muted-foreground mb-8">
                  Discover meaningful connections based on shared interests, values, and authentic conversations.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={300}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted}
                    icon={<Heart className="w-5 h-5" />}
                    className="px-8"
                  >
                    {user ? "Go to Dashboard" : "Get Started"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleTryDemo}
                    className="px-8"
                  >
                    {user ? "Your Profile" : "Log In"}
                  </Button>
                </div>
              </AnimatedContainer>
            </div>
            
            <div className="md:w-1/2 relative">
              <AnimatedContainer 
                animation="scale-in" 
                delay={400}
                className="relative z-10"
              >
                <div className="relative">
                  {/* Phone mockup */}
                  <div className="w-full max-w-[320px] mx-auto aspect-[1/2] rounded-[40px] border-8 border-gray-800 bg-white shadow-xl overflow-hidden relative">
                    {/* App screen */}
                    <div className="absolute inset-0 bg-gradient-to-b from-background to-muted p-3">
                      {/* App content mockup */}
                      <div className="h-1 w-20 bg-muted-foreground/30 mx-auto rounded-full mb-4" />
                      
                      {/* Mockup profile */}
                      <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] mb-3 bg-cover bg-center"
                           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80')" }}
                      >
                        <div className="w-full h-full flex items-end p-3 bg-gradient-to-b from-transparent via-transparent to-black/60">
                          <div className="text-white">
                            <h3 className="text-lg font-medium">Sophie, 27</h3>
                            <p className="text-xs text-white/80">New York • 2 miles away</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons mockup */}
                      <div className="flex justify-center mt-2 gap-3">
                        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                          <div className="w-5 h-5 text-rose-500">✕</div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary shadow-md flex items-center justify-center">
                          <div className="w-5 h-5 text-white">♥</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/20 -z-10 animate-pulse-subtle" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-secondary/20 -z-10 animate-pulse-subtle" style={{ animationDelay: "1s" }} />
                </div>
              </AnimatedContainer>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <AnimatedContainer animation="slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Designed for meaningful connections
            </h2>
          </AnimatedContainer>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Smart Matching",
                description: "Our algorithm learns your preferences and suggests compatible matches",
                icon: "✨"
              },
              {
                title: "Authentic Profiles",
                description: "Verified profiles and detailed bios to help you find the right match",
                icon: "👤"
              },
              {
                title: "Safe Conversations",
                description: "Enjoy private, secure messaging with your matches",
                icon: "💬"
              },
            ].map((feature, index) => (
              <AnimatedContainer 
                key={feature.title}
                animation="slide-up"
                delay={index * 100}
                className="bg-background rounded-xl p-6 border border-border shadow-sm hover-card-effect"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedContainer animation="slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to find your match?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of singles who have already found meaningful connections on loveSpark.
              </p>
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                icon={<Heart className="w-5 h-5" />}
                className="px-8"
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
              </Button>
            </AnimatedContainer>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-lg font-semibold">
                <span className="text-primary">love</span>
                <span>Spark</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} loveSpark. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
