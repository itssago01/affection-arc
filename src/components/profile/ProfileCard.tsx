
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, X, MessageSquare, UserPlus } from "lucide-react";
import { Button } from "../common/Button";
import AnimatedContainer from "../common/AnimatedContainer";

export type ProfileData = {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  images: string[];
  distance: string;
};

type ProfileCardProps = {
  profile: ProfileData;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onMessage?: (id: string) => void;
  variant?: "swipe" | "match" | "preview";
  className?: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onLike,
  onDislike,
  onMessage,
  variant = "swipe",
  className,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragThreshold = 100;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleLike = () => {
    setExitDirection("right");
    setTimeout(() => {
      onLike?.(profile.id);
    }, 300);
  };

  const handleDislike = () => {
    setExitDirection("left");
    setTimeout(() => {
      onDislike?.(profile.id);
    }, 300);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (variant !== "swipe") return;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragEnd = () => {
    if (variant !== "swipe") return;
    setIsDragging(false);
    
    if (dragOffset > dragThreshold) {
      handleLike();
    } else if (dragOffset < -dragThreshold) {
      handleDislike();
    }
    
    setDragOffset(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || variant !== "swipe") return;
    
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const card = e.currentTarget as HTMLDivElement;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offset = clientX - centerX;
    
    setDragOffset(offset);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <AnimatedContainer
      className={cn(
        "relative overflow-hidden rounded-xl max-w-sm w-full mx-auto transition-all duration-300",
        {
          "animate-slide-out-right": exitDirection === "right",
          "animate-slide-out-left": exitDirection === "left",
          "h-[70vh]": variant === "swipe",
          "h-64": variant === "match",
          "h-auto": variant === "preview",
          "shadow-md": variant !== "preview",
          "cursor-grab": variant === "swipe" && !isDragging,
          "cursor-grabbing": variant === "swipe" && isDragging,
        },
        className
      )}
      animation="scale-in"
      style={
        isDragging ? {
          transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
          transition: 'none'
        } : {}
      }
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Profile Images with Navigation Dots */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${profile.images[currentImageIndex]})` }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-b transition-opacity duration-300",
          {
            "from-transparent via-transparent to-black/70": !showDetails,
            "from-black/40 via-black/30 to-black/70": showDetails,
          }
        )}
        onClick={toggleDetails}
      />

      {/* Image Navigation */}
      {profile.images.length > 1 && (
        <>
          <div 
            className="absolute top-0 left-0 bottom-0 w-1/3 z-10" 
            onClick={prevImage}
          />
          <div 
            className="absolute top-0 right-0 bottom-0 w-1/3 z-10" 
            onClick={nextImage}
          />
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 z-20">
            {profile.images.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === currentImageIndex 
                    ? "w-6 bg-white" 
                    : "w-4 bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Basic Profile Info */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300",
          {
            "translate-y-0": !showDetails || variant !== "swipe",
            "translate-y-full": showDetails && variant === "swipe",
          }
        )}
      >
        <h2 className="text-2xl font-semibold">{profile.name}, {profile.age}</h2>
        <p className="text-white/90">{profile.location} • {profile.distance}</p>
      </div>

      {/* Detailed Profile Info (slides up) */}
      {variant === "swipe" && (
        <div 
          className={cn(
            "absolute inset-0 bg-black/60 p-4 text-white overflow-y-auto transition-all duration-300 backdrop-blur-sm",
            {
              "translate-y-full": !showDetails,
              "translate-y-0": showDetails,
            }
          )}
        >
          <div className="pt-16">
            <h2 className="text-2xl font-semibold">{profile.name}, {profile.age}</h2>
            <p className="text-white/90 mb-4">{profile.location} • {profile.distance}</p>
            
            <h3 className="text-lg font-medium mb-2">About me</h3>
            <p className="mb-4">{profile.bio}</p>
            
            <h3 className="text-lg font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {profile.interests.map((interest, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white/20 text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons for Swipe Cards */}
      {variant === "swipe" && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-30">
          <Button
            size="lg"
            variant="glass"
            className="bg-white/90 text-rose-500 hover:bg-white"
            onClick={handleDislike}
          >
            <X className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            variant="glass"
            className="bg-white/90 text-primary hover:bg-white"
            onClick={handleLike}
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Action Buttons for Match Cards */}
      {variant === "match" && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="glass"
            className="p-2"
            onClick={() => onMessage?.(profile.id)}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      )}
    </AnimatedContainer>
  );
};

export default ProfileCard;
