import { auth } from '@/lib/auth/auth';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Session } from 'next-auth';

const supabaseClient = async ():Promise<SupabaseClient> => {
  const session = await auth();
  const {supabaseAccessToken} = session as Session;
  console.log("session=>", session);
  console.log(supabaseAccessToken);

  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );
}

export default supabaseClient;