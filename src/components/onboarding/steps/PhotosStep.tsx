import React, { useRef, useState } from "react";
import AnimatedContainer from "../../common/AnimatedContainer";
import { Upload, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PhotosStepProps {
  title: string;
  description: string;
  photos: string[];
  onPhotoUpload: (index: number, file?: File) => void;
  onPhotoDelete?: (index: number) => void;
  error?: string;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ 
  title, 
  description, 
  photos, 
  onPhotoUpload,
  onPhotoDelete,
  error
}) => {
  // Count the number of uploaded photos
  const uploadedPhotoCount = photos.filter(photo => photo).length;
  
  // Create refs for file inputs
  const fileInputRefs = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));
  
  // State for the preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  
  const handleClick = (index: number) => {
    // If there's already a photo, show preview
    if (photos[index]) {
      setPreviewIndex(index);
      setPreviewOpen(true);
      return;
    }
    
    // Otherwise trigger file input click
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
  
  const handleDeletePhoto = (index: number) => {
    if (onPhotoDelete) {
      onPhotoDelete(index);
    }
    setPreviewOpen(false);
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
                "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors duration-200 relative group",
                idx < 3 && "border-primary/50"
              )}
              onClick={() => handleClick(idx)}
            >
              {photos[idx] ? (
                <>
                  <img 
                    src={photos[idx]}
                    alt={`User photo ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <X className="w-6 h-6 text-white" />
                  </div>
                </>
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
      
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Photo Preview</DialogTitle>
          </DialogHeader>
          {previewIndex !== null && photos[previewIndex] && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-64 md:h-80 overflow-hidden rounded-md">
                <img 
                  src={photos[previewIndex]}
                  alt={`Photo preview ${previewIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <Button 
                variant="destructive" 
                onClick={() => handleDeletePhoto(previewIndex)}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Photo
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosStep;
