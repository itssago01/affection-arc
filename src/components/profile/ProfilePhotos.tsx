
import React from "react";
import { cn } from "@/lib/utils";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Button } from "@/components/common/Button";

interface ProfilePhotosProps {
  images: string[];
  isEditing: boolean;
}

const ProfilePhotos = ({ images, isEditing }: ProfilePhotosProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((image, index) => (
        <AnimatedContainer 
          key={index} 
          animation="scale-in" 
          delay={index * 100} 
          className={cn(
            "relative aspect-square rounded-xl overflow-hidden",
            index === 0 ? "col-span-3 md:col-span-2 md:row-span-2" : ""
          )}
        >
          <img 
            src={image} 
            alt={`Photo ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button variant="glass" size="sm">Change</Button>
            </div>
          )}
        </AnimatedContainer>
      ))}
    </div>
  );
};

export default ProfilePhotos;
