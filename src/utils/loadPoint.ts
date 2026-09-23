import { supabase } from "../lib/supabase";

export async function loadPoint() {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    return 0;
  }

  const { data, error } = await supabase
    .from("users")
    .select("point")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("loadPoint error:", error);
    localStorage.setItem("point", "0");
    localStorage.setItem("points", "0");
    return 0;
  }

  const point = Number(data.point || 0);

  localStorage.setItem("point", String(point));
  localStorage.setItem("points", String(point));

  return point;
}