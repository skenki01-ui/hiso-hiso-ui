// src/utils/point.ts

export const getPoint = () => {
  return Number(localStorage.getItem("point") || 0);
};

export const setPoint = (p: number) => {
  localStorage.setItem("point", String(p));
};

export const addPoint = (p: number) => {
  setPoint(getPoint() + p);
};

export const usePoint = (p: number) => {
  const now = getPoint();
  if (now < p) return false;
  setPoint(now - p);
  return true;
};