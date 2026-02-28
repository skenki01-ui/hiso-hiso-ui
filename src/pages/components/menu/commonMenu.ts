// src/components/menu/commonMenu.ts

export type MenuItem = {
  label: string;
  onClick: () => void;
};

export function buildCommonMenuItems(
  navigate: (path: string) => void,
  close: () => void
): MenuItem[] {
  return [
    {
      label: "説明",
      onClick: () => {
        close();
        navigate("/about");
      },
    },

    // ★ここを「最初の形」に戻す
    {
      label: "ポイントについて",
      onClick: () => {
        close();
        navigate("/about/points"); // ← ポイントの説明ページ
      },
    },

    {
      label: "サブスクについて",
      onClick: () => {
        close();
        navigate("/about/subscription");
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
      onClick: () => {
        close();
      },
    },
  ];
}