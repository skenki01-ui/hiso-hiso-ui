import { supabase } from "./supabase";

export async function ensureUser(nickname: string) {

  try {

    const existing = localStorage.getItem("user_id");
    if (existing) return existing;

    const id = crypto.randomUUID();

    const { error } = await supabase
      .from("users")
      .insert({
        id,
        nickname: nickname || "ゲスト",
        point: 100
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return null;
    }

    localStorage.setItem("user_id", id);

    return id;

  } catch (e) {
    console.error("ensureUser crash:", e);
    return null;
  }
}