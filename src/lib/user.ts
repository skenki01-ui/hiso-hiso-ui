import { supabase } from "./supabase";

export async function ensureUser(nickname: string) {

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

  if (error) return null;

  localStorage.setItem("user_id", id);

  return id;
}