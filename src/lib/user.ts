export async function ensureUser(nickname: string) {

  // 🔥 すでにあるならそれ使う（最重要）
  const existing = localStorage.getItem("user_id");
  if (existing) return existing;

  // 🔥 新規作成は1回だけ
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