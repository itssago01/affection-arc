
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zngzgjurznaslxymvvwo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3pnanVyem5hc2x4eW12dndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTg4MjgsImV4cCI6MjA1ODIzNDgyOH0.8yI6VWSXgcAcQkysSZStxTOt6awvZ_XJvKe7T4PtPA8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
