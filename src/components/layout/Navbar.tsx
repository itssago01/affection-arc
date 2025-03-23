
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Heart, MessageSquare, User, Settings, Crown, LogOut, LogIn } from "lucide-react";
import AnimatedContainer from "../common/AnimatedContainer";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const { isSubscribed } = useSubscription();
  const { user, signOut } = useAuth();

  useEffect(() => {
    setIsHome(location.pathname === "/");
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const navbarClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-4",
    {
      "bg-transparent": isHome && !scrolled,
      "glass shadow-sm": !isHome || scrolled,
    }
  );

  const navItems = [
    { path: "/dashboard", icon: <Heart className="w-5 h-5" />, label: "Discover" },
    { path: "/matches", icon: <Heart className="w-5 h-5 fill-current" />, label: "Matches" },
    { path: "/messages", icon: <MessageSquare className="w-5 h-5" />, label: "Messages" },
    { path: "/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
  ];

  return (
    <nav className={navbarClass}>
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-lg font-semibold">
            <span className="text-primary">love</span>
            <span>Spark</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isHome && user && navItems.map((item, index) => (
              <AnimatedContainer
                key={item.path}
                animation="slide-down"
                delay={100 + index * 50}
                className="flex"
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-1 py-1 px-2 rounded-full transition-all duration-300 hover:bg-muted/80",
                    {
                      "text-primary": location.pathname === item.path,
                      "text-muted-foreground": location.pathname !== item.path,
                    }
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </AnimatedContainer>
            ))}
          </div>

          {/* Mobile Navigation Bar (fixed at bottom) */}
          {!isHome && user && (
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden flex justify-around items-center py-3 px-4 z-50">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center text-xs",
                    {
                      "text-primary": location.pathname === item.path,
                      "text-muted-foreground": location.pathname !== item.path,
                    }
                  )}
                >
                  {item.icon}
                  <span className="mt-1">{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Settings and Subscription (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/subscription"
                  className={cn(
                    "flex items-center gap-1 p-2 rounded-full hover:bg-muted/80 transition-all duration-300",
                    {
                      "text-amber-400": isSubscribed,
                      "text-foreground": !isSubscribed,
                    }
                  )}
                >
                  <Crown className={cn("w-5 h-5", { "fill-amber-400": isSubscribed })} />
                  {isSubscribed && <span className="text-sm font-medium">Premium</span>}
                </Link>
                <Link
                  to="/settings"
                  className={cn(
                    "p-2 rounded-full hover:bg-muted/80 transition-all duration-300",
                    {
                      "text-primary": location.pathname === "/settings",
                      "text-foreground": location.pathname !== "/settings",
                    }
                  )}
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-muted/80 transition-all duration-300 text-foreground"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1 py-1 px-3 rounded-full border border-primary text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>Log in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
