import supabase from "@/lib/supabase/supabase";
import { v4 as uuidv4 } from "uuid";

export const upload = async ( file: File ) => {
  if (file!!.type.match("image.*")) {
    const fileExtension = file!!.name.split(".").pop()
    const supabaseClient = await supabase();
    const { data, error } = await supabaseClient.storage
      .from('message')
      .upload(`img/${uuidv4()}.${fileExtension}`, file!!)
    if (error) {
      console.log("エラーが発生しました：" + error.message)
      return null
    }
    // 公開URLを取得して返す
    const { data: { publicUrl } } = supabaseClient.storage
      .from('message')
      .getPublicUrl(data.path);

    return publicUrl;
  } else {
    console.log("画像ファイル以外はアップロード出来ません。")
  }
}