import { supabase } from "./supabase";

export async function ensureUser(nickname: string) {
  try {
    const savedId = localStorage.getItem("user_id");
    const name = nickname || localStorage.getItem("nickname") || "ゲスト";

    if (savedId) {
      const { data } = await supabase
        .from("users")
        .select("id, point")
        .eq("id", savedId)
        .single();

      if (data) {
        return savedId;
      }

      const { error: insertError } = await supabase
        .from("users")
        .insert({
          id: savedId,
          nickname: name,
          point: 100,
        });

      if (!insertError) {
        return savedId;
      }

      console.error("restore user insert error:", insertError);
    }

    const id = crypto.randomUUID();

    const { error } = await supabase
      .from("users")
      .insert({
        id,
        nickname: name,
        point: 100,
      });

    if (error) {
      console.error("supabase insert error:", error);
      return "";
    }

    localStorage.setItem("user_id", id);

    return id;
  } catch (e) {
    console.error("ensureUser crash:", e);
    return "";
  }
}