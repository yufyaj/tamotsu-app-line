import { Tables } from "@/types/database.types";
import { supabaseDbClient } from "../supabase/supabase"

export const selectUser = async(sub: string): Promise<Tables<"users"> | null> => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('users') 
      .select('*') 
      .eq('sub', sub) 
      .single(); 

    if (error) {
      return null;
    }

    return data; 
  } catch (error) {
    return null; // エラー時はnullを返す
  }
}

export const insertUser = async (user: Tables<"users">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('users').insert(user);

    if (error) {
      return null;
    }
  } catch (errro) {
    return null;
  }
}