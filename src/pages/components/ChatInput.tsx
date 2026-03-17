export default function ChatInput() {
  return (
    <div style={styles.wrap}>
      <input style={styles.input} placeholder="=TYPE MESSAGE=" />
      <button style={styles.send}>送信</button>
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
  },
};