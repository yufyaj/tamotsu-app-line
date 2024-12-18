import supabase from "@/lib/supabase/supabase";
import { v4 as uuidv4 } from "uuid";

export const upload = async ( file: File ) => {
  if (file!!.type.match("image.*")) {
    const fileExtension = file!!.name.split(".").pop()
    const supabaseClient = await supabase();
    const { data, error } = await supabaseClient.storage
      .from('test')
      .upload(`img/${uuidv4()}.${fileExtension}`, file!!)
    if (error) {
      console.log("エラーが発生しました：" + error.message)
      return null
    }
    return data!.fullPath
  } else {
    console.log("画像ファイル以外はアップロード出来ません。")
  }
}