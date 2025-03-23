
import React from "react";
import AnimatedContainer from "../../common/AnimatedContainer";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotosStepProps {
  title: string;
  description: string;
  photos: string[];
  onPhotoUpload: (index: number) => void;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ 
  title, 
  description, 
  photos, 
  onPhotoUpload 
}) => {
  return (
    <div className="max-w-md mx-auto">
      <AnimatedContainer animation="slide-up">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors duration-200",
                idx < 2 && "border-primary/50"
              )}
              onClick={() => onPhotoUpload(idx)}
            >
              {photos[idx] ? (
                <img 
                  src={photos[idx]}
                  alt={`User photo ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className={cn(
                  "w-6 h-6",
                  idx < 2 ? "text-primary" : "text-muted-foreground"
                )} />
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground">
          Upload at least 2 photos to continue. Tap each box to upload.
        </p>
      </AnimatedContainer>
    </div>
  );
};

export default PhotosStep;
