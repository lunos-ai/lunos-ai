import { createClient } from '@supabase/supabase-js';

// Define URL and Key variables to make the call cleaner
// WARNING: This is a temporary, INSECURE fix due to hardcoding the key.
const SUPABASE_URL = 'https://zvawrbajdslrkbsgyegn.supabase.co';

// NOTE: You must choose ONE key. The first one you provided is the Service Role Key.
// Use this one if this file is only run on the server (API Routes).
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2YXdyYmFqZHNscmtic2d5ZWduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIzMTMxMSwiZXhwIjoyMDc4ODA3MzExfQ.l1twPcFGg310GgOCWk7u8i4wplcM_bAAyyoC8tA5CTE';

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

export default supabase;