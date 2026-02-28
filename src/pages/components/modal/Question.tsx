import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AskLaterModal({ open, onClose }: Props) {
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [positions, setPositions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState<string>("");

  if (!open) return null;

  const togglePosition = (value: string) => {
    setPositions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleClose = () => {
    console.log({ gender, age, positions, freeText });
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div>
            <div style={{ fontWeight: 800 }}>よかったら教えて</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              今は答えなくても大丈夫
            </div>
          </div>
          <button style={closeBtnStyle} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={bodyStyle}>
          <Section title="性別">
            {["男性", "女性", "その他", "答えたくない"].map((v) => (
              <Radio
                key={v}
                label={v}
                checked={gender === v}
                onChange={() => setGender(v)}
              />
            ))}
          </Section>

          <Section title="年齢層">
            {["10代", "20代", "30代", "40代", "50代以上", "答えたくない"].map(
              (v) => (
                <Radio
                  key={v}
                  label={v}
                  checked={age === v}
                  onChange={() => setAge(v)}
                />
              )
            )}
          </Section>

          <Section title="立場・環境">
            {[
              "学生",
              "社会人",
              "主婦・主夫",
              "フリーランス",
              "求職中",
              "その他",
            ].map((v) => (
              <Checkbox
                key={v}
                label={v}
                checked={positions.includes(v)}
                onChange={() => togglePosition(v)}
              />
            ))}
          </Section>

          <Section title="自由記入">
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={4}
              placeholder="要望・質問・気になったことなど自由にどうぞ"
              style={textareaStyle}
            />
          </Section>
        </div>

        <div style={footerStyle}>
          <button style={footerBtnStyle} onClick={handleClose}>
            今はここまで
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function Radio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label style={itemStyle}>
      <input type="radio" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label style={itemStyle}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  zIndex: 200,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle: CSSProperties = {
  width: "92%",
  maxWidth: 420,
  maxHeight: "86vh",
  background: "#1a1124",
  color: "#fff",
  borderRadius: 14,
  display: "flex",
  flexDirection: "column",
};

const headerStyle: CSSProperties = {
  padding: "12px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const closeBtnStyle: CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  border: "none",
  color: "#fff",
  borderRadius: 8,
  width: 32,
  height: 32,
  fontSize: 18,
  cursor: "pointer",
};

const bodyStyle: CSSProperties = {
  padding: "12px 14px",
  overflowY: "auto",
};

const footerStyle: CSSProperties = {
  padding: 12,
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

const footerBtnStyle: CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: 10,
  border: "none",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const itemStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  marginBottom: 6,
  fontSize: 14,
};

const textareaStyle: CSSProperties = {
  width: "100%",
  borderRadius: 10,
  padding: 10,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  resize: "none",
};