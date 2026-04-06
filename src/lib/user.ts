import { supabase } from "./supabase";

export async function ensureUser(nickname: string) {

  try {

    // 🔥 すでにあるならそれ使う
    const existing = localStorage.getItem("user_id");
    if (existing) return existing;

    // 🔥 新規作成
    const id = crypto.randomUUID();

    // 🔥 supabase undefined防止
    if (!supabase) {
      console.error("supabase not initialized");
      return id;
    }

    const { error } = await supabase
      .from("users")
      .insert({
        id,
        nickname: nickname || "ゲスト",
        point: 100
      });

    if (error) {
      console.error("supabase insert error:", error);
      return id;
    }

    localStorage.setItem("user_id", id);

    return id;

  } catch (e) {
    console.error("ensureUser crash:", e);

    // 🔥 最悪でもUI止めない
    const fallbackId = crypto.randomUUID();
    localStorage.setItem("user_id", fallbackId);
    return fallbackId;
  }
}