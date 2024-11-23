import { Tables } from "@/types/database.types";
import { supabaseDbClient } from "../supabase/supabase"

export const selectClientProfile = async(id: string): Promise<Tables<"client_profiles"> | null> => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('client_profiles') 
      .select('*') 
      .eq('user_id', id) 
      .single(); 

    if (error) {
      return null;
    }

    return data; 
  } catch (error) {
    return null; // エラー時はnullを返す
  }
}

export const upsertClientProfile = async (userProfile: Tables<"client_profiles">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('client_profiles').upsert(userProfile);

    if (error) {
      return null;
    }
  } catch (errro) {
    return null;
  }
}
