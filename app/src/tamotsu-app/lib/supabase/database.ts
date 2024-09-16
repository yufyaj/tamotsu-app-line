import { Database, Tables } from "@/database.types";
import { supabaseDbClient } from "./supabase"

export const upsertUser = async (users: Tables<"users">) => {
  const supabase = supabaseDbClient()
  const result = await supabase.from('users').upsert(users);
  console.log("result=>", result)
}