export function hasMidnightSub() {
  return localStorage.getItem("sub_midnight") === "true"
}

export function hasFullSub() {
  return localStorage.getItem("sub_full") === "true"
}