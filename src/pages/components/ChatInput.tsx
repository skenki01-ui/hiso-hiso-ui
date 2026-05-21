import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div style={styles.wrap}>
      <input
        style={styles.input}
        placeholder="メッセージ入力"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button
        style={styles.send}
        onClick={handleSend}
      >
        送信
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    gap: 8,
    padding: 10,
    background: "#fff",
    borderTop: "1px solid #ccc",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #999",
  },

  send: {
    padding: "0 16px",
    borderRadius: 6,
    border: "2px solid #333",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};