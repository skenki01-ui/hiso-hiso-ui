// src/components/menu/commonMenu.ts
import { NavigateFunction } from "react-router-dom";

type MenuItem = {
  label: string;
  onClick: () => void;
};

export function buildCommonMenuItems(
  navigate: NavigateFunction,
  close: () => void
): MenuItem[] {
  return [
    {
      label: "ポイントについて",
      onClick: () => {
        close();
        navigate("/purchase/points");
      },
    },
    {
      label: "友だちに教える",
      onClick: () => {
        close();
        navigate("/share");
      },
    },
    {
      label: "閉じる",
      onClick: close,
    },
  ];
}