
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const BUCKET_NAME = "message-attachments";

export type FileUploadResult = {
  url: string;
  type: string;
  success: boolean;
  error?: string;
};

export type VoiceClipUploadResult = {
  url: string;
  duration: number;
  success: boolean;
  error?: string;
};

// Helper to ensure the message-attachments bucket exists
export const ensureMessageAttachmentsBucket = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(
        BUCKET_NAME,
        {
          public: true,
        }
      );
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        return false;
      }
      
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in ensureMessageAttachmentsBucket:", error);
    return false;
  }
};

// Upload a file attachment to Supabase storage
export const uploadFileAttachment = async (
  file: File,
  userId: string,
  matchId: string
): Promise<FileUploadResult> => {
  try {
    await ensureMessageAttachmentsBucket();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${matchId}/${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);
    
    if (error) {
      console.error("Error uploading file:", error);
      return {
        url: "",
        type: "",
        success: false,
        error: error.message
      };
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    return {
      url: publicUrl,
      type: file.type,
      success: true
    };
    
  } catch (error) {
    console.error("Error in uploadFileAttachment:", error);
    return {
      url: "",
      type: "",
      success: false,
      error: "Failed to upload file"
    };
  }
};

// Upload a voice clip to Supabase storage
export const uploadVoiceClip = async (
  audioBlob: Blob,
  duration: number,
  userId: string,
  matchId: string
): Promise<VoiceClipUploadResult> => {
  try {
    await ensureMessageAttachmentsBucket();
    
    const fileName = `${userId}/${matchId}/${uuidv4()}.webm`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, audioBlob, {
        contentType: 'audio/webm'
      });
    
    if (error) {
      console.error("Error uploading voice clip:", error);
      return {
        url: "",
        duration: 0,
        success: false,
        error: error.message
      };
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    return {
      url: publicUrl,
      duration,
      success: true
    };
    
  } catch (error) {
    console.error("Error in uploadVoiceClip:", error);
    return {
      url: "",
      duration: 0,
      success: false,
      error: "Failed to upload voice clip"
    };
  }
};
