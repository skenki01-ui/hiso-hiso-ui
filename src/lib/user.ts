import { supabase } from "./supabase";

export async function ensureUser(nickname: string) {

  const { data, error } = await supabase
    .from("users")
    .insert({
      nickname: nickname || "ゲスト",
      point: 100
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  const user = data;

  localStorage.setItem("nickname", user.nickname);
  localStorage.setItem("point", String(user.point));
  localStorage.setItem("user_id", user.id);

  return user.id;
}

export function getLocalUserId() {
  return localStorage.getItem("user_id");
}

export function getUserPoint() {
  return Number(localStorage.getItem("point") || 0);
}