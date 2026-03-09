const KEY = "hiso_turns";
const PASS_KEY = "hiso_daypass";

export function getTurns() {
  return Number(localStorage.getItem(KEY) || 0);
}

export function setTurns(n) {
  localStorage.setItem(KEY, n);
}

export function addTurns(n) {
  const t = getTurns();
  setTurns(t + n);
}

export function useTurn() {
  const t = getTurns();
  if (t > 0) {
    setTurns(t - 1);
    return true;
  }
  return false;
}

export function activateDayPass() {
  const until = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem(PASS_KEY, until);
}

export function hasDayPass() {
  const until = Number(localStorage.getItem(PASS_KEY) || 0);
  return Date.now() < until;
}