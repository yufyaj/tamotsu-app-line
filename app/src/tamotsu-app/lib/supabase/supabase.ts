import { Database } from '@/types/database.types';
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseClient = ():SupabaseClient => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
}

export const supabaseDbClient = ():SupabaseClient<Database> => {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  );
}

export default supabaseClient;