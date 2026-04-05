import { supabase } from "../lib/supabase";

export async function loadPoint() {

  const userId = localStorage.getItem("user_id");

  if (!userId) return;

  const { data } = await supabase
    .from("users")
    .select("point")
    .eq("id", userId)
    .single();

  if (data) {
    localStorage.setItem("point", String(data.point || 0));
  }

}