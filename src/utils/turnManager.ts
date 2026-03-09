const TURN_KEY = "hs_turn_remaining";
const WINDOW_KEY = "hs_turn_window_start";

function isNightTime() {
  const h = new Date().getHours();
  return h >= 20 || h < 5;
}

function getTurnAllowance() {
  return isNightTime() ? 6 : 3;
}

function getWindowStart() {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const h = d.getHours();

  if (h >= 20) return new Date(y, m, day, 20).getTime();
  if (h < 5) return new Date(y, m, day - 1, 20).getTime();
  return new Date(y, m, day, 5).getTime();
}

export function loadTurns() {

  const allowance = getTurnAllowance();
  const start = getWindowStart();

  const savedStart = Number(localStorage.getItem(WINDOW_KEY) || "0");
  const savedRemaining = Number(localStorage.getItem(TURN_KEY) || allowance);

  if (savedStart !== start) {
    localStorage.setItem(WINDOW_KEY, String(start));
    localStorage.setItem(TURN_KEY, String(allowance));
    return allowance;
  }

  return savedRemaining;
}

export function useTurn() {

  const remaining = loadTurns();

  if (remaining <= 0) return false;

  const next = remaining - 1;

  localStorage.setItem(TURN_KEY, String(next));

  return true;
}

export function getRemainingTurns() {
  return loadTurns();
}