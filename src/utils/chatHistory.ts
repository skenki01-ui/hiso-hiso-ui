import { supabase } from "../lib/supabase";

export async function saveMessage(
  roomId: string,
  role: "user" | "assistant",
  content: string
) {
  const { error } = await supabase.from("messages").insert({
    room_id: roomId,
    role,
    content,
  });

  if (error) {
    console.error("saveMessage error", error);
  }
}

export async function loadMessages(roomId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("loadMessages error", error);
    return [];
  }

  return data;
}