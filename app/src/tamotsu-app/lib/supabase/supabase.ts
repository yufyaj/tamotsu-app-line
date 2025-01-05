import { Database } from '@/types/database.types';
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 環境変数の存在確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Required environment variables are not set.')
}

// 基本的なSupabaseクライアント
const supabaseClient = (): SupabaseClient => {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// 型付きSupabaseクライアント
export const supabaseDbClient = (): SupabaseClient<Database> => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'public'
    }
  });
}

export default supabaseClient;