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

// 🔥 修正ここ
export const usePoint = async (p: number) => {

  const now = getPoint();

  if (now < p) return false;

  try {

    const userId = localStorage.getItem("user_id") || "guest";

    const res = await fetch("http://localhost:3000/use-point", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        amount: p
      })
    });

    const data = await res.json();

    if (!data.success) return false;

    // ローカルも更新
    setPoint(data.point);

    return true;

  } catch (e) {
    console.error(e);
    return false;
  }

};