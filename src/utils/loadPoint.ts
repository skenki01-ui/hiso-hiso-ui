// src/utils/loadPoint.ts
import { getLocalUserId, getUserPoint } from "../lib/user";

export async function loadPoint() {
  const uid = getLocalUserId();
  if (!uid) return;

  const p = await getUserPoint(uid);
  if (p === null) return;

  // 既存UIが localStorage("point") を見てる前提を崩さない
  localStorage.setItem("point", String(p));
}