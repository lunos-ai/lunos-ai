import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zvawrbajdslrkbsgyegn.supabase.co' || '',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2YXdyYmFqZHNscmtic2d5ZWduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIzMTMxMSwiZXhwIjoyMDc4ODA3MzExfQ.l1twPcFGg310GgOCWk7u8i4wplcM_bAAyyoC8tA5CTE' || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2YXdyYmFqZHNscmtic2d5ZWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzEzMTEsImV4cCI6MjA3ODgwNzMxMX0.gjDQJj9TE07a3bBMbiR-AZd01ym5AIMRsHHczAlkFyg' || ''
);

export default supabase;