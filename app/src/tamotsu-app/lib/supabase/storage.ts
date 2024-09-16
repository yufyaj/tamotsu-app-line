import supabase from "@/lib/supabase/supabase";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const upload = async ( file: File ) => {
  if (file!!.type.match("image.*")) {
    const fileExtension = file!!.name.split(".").pop()
    const supabaseClient = await supabase();
    const { error } = await supabaseClient.storage
      .from('test')
      .upload(`img/${uuidv4()}.${fileExtension}`, file!!)
    if (error) {
      console.log("エラーが発生しました：" + error.message)
      return
    }
  } else {
    console.log("画像ファイル以外はアップロード出来ません。")
  }
}