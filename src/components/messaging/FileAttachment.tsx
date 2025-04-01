
import React, { useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { Image, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface FileAttachmentProps {
  onFileSelected: (file: File) => void;
  onCancel: () => void;
  isAttaching: boolean;
  attachmentType: "file" | "image" | null;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  onFileSelected,
  onCancel,
  isAttaching,
  attachmentType
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size exceeds 5MB limit",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };
  
  // Trigger file input click
  const triggerFileInput = (type: "file" | "image") => {
    if (type === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (type === "image" && imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onCancel();
  };
  
  // Handle send
  const handleSend = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };
  
  return (
    <div>
      {/* File input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.zip,.rar"
      />
      
      {/* Image input (hidden) */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      {!selectedFile ? (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => triggerFileInput("file")}
            type="button"
          >
            <Paperclip className="w-5 h-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => triggerFileInput("image")}
            type="button"
          >
            <Image className="w-5 h-5" />
            <span className="sr-only">Attach image</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full">
          {previewUrl ? (
            <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-grow truncate text-sm">
            {selectedFile.name}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            type="button"
            className="h-8 w-8 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            type="button"
          >
            Send
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
