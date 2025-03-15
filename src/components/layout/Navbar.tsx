
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Heart, MessageSquare, User, Search, Settings } from "lucide-react";
import AnimatedContainer from "../common/AnimatedContainer";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isHome, setIsHome] = useState(true);

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
            {!isHome && navItems.map((item, index) => (
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
          {!isHome && (
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

          {/* Settings and Search (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/search"
              className="p-2 rounded-full hover:bg-muted/80 transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/settings"
              className="p-2 rounded-full hover:bg-muted/80 transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
