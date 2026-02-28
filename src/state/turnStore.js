let turns = 6; // =初期ターン数=

export function getTurns() {
  return turns;
}

export function consumeTurn() {
  if (turns > 0) turns -= 1;
}

export function resetTurns() {
  turns = 6;
}