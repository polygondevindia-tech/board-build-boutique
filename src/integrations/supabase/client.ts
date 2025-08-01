// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qcilwcdxtdbmskzrpvff.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjaWx3Y2R4dGRibXNrenJwdmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1OTYzOTUsImV4cCI6MjA2OTE3MjM5NX0.ovd6u2q1Z8YcI5yOSjyeh-Lgm1yczODHtegRrnnUgT0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});