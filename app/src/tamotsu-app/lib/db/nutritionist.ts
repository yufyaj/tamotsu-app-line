import { Tables } from "@/types/database.types";
import { supabaseDbClient } from "../supabase/supabase"

export const selectNutritionistProfileList = async(query: string, page: number): Promise<Tables<"nutritionist_profiles">[] | null> => {
  try {
    const from = page * 10
    console.log("from:", from, ", to:", from + 9)
    const { data, error } = await supabaseDbClient()
      .from('nutritionist_profiles') 
      .select('*') 
      .or(`name.like.%${query}%, specialty.like.%${query}%, bio.like.%${query}%`)
      .range(from, from + 9)
      .order('name');

    if (error) {
      return null;
    }

    return data; 
  } catch (error) {
    return null; // エラー時はnullを返す
  }
}

export const selectNutritionistProfile = async(id: string): Promise<Tables<"nutritionist_profiles"> | null> => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('nutritionist_profiles') 
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

export const upsertNutritionistProfile = async (nutritionistProfile: Tables<"nutritionist_profiles">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('nutritionist_profiles').upsert(nutritionistProfile);

    if (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
}