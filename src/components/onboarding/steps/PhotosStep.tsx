
import React, { useRef } from "react";
import AnimatedContainer from "../../common/AnimatedContainer";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PhotosStepProps {
  title: string;
  description: string;
  photos: string[];
  onPhotoUpload: (index: number, file?: File) => void;
  error?: string;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ 
  title, 
  description, 
  photos, 
  onPhotoUpload,
  error
}) => {
  // Count the number of uploaded photos
  const uploadedPhotoCount = photos.filter(photo => photo).length;
  
  // Create refs for file inputs
  const fileInputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));
  
  const handleClick = (index: number) => {
    // Trigger file input click
    if (fileInputRefs[index]?.current) {
      fileInputRefs[index].current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoUpload(index, file);
    }
  };
  
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
                idx < 3 && "border-primary/50"
              )}
              onClick={() => handleClick(idx)}
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
                  idx < 3 ? "text-primary" : "text-muted-foreground"
                )} />
              )}
              
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRefs[idx]}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, idx)}
              />
            </div>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground">
          Upload at least 3 photos to continue. Tap each box to upload from your device.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-2 text-sm">
          <span className={uploadedPhotoCount >= 3 ? "text-green-500" : "text-muted-foreground"}>
            {uploadedPhotoCount} of 3 required photos uploaded
          </span>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default PhotosStep;
