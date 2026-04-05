export function hasFullSub(): boolean {
  return localStorage.getItem("hs_sub_all_unlimited") === "1";
}

export function hasMidnightSub(): boolean {
  return localStorage.getItem("hs_sub_night_unlimited") === "1";
}

export function startFullSub() {
  localStorage.setItem("hs_sub_all_unlimited", "1");
}

export function startMidnightSub() {
  localStorage.setItem("hs_sub_night_unlimited", "1");
}

export function cancelSub() {
  localStorage.removeItem("hs_sub_all_unlimited");
  localStorage.removeItem("hs_sub_night_unlimited");
}