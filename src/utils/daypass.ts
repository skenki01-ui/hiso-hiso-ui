export function isDayPassActive(): boolean {
  const until = Number(localStorage.getItem("hs_day_pass_until") || "0");
  return Date.now() < until;
}

export function startDayPass() {
  const until = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem("hs_day_pass_until", String(until));
}