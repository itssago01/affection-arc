
import { supabase } from "@/integrations/supabase/client";

// Check if the storage bucket exists and create it if it doesn't
export const ensureStorageBucket = async (bucketName: string) => {
  try {
    // Get list of existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(
        bucketName,
        {
          public: true, // Make the bucket public
          fileSizeLimit: 5242880, // 5MB file size limit
        }
      );
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        return false;
      }
      
      console.log(`Created storage bucket: ${bucketName}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in ensureStorageBucket:", error);
    return false;
  }
};

// Initialize the user-images bucket on app startup
export const initializeStorage = async () => {
  return await ensureStorageBucket('user-images');
};
