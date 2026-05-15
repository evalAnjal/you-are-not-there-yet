import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key.
// Set these in your local environment (.env.local):
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default supabaseAdmin;
