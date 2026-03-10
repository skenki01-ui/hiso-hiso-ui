import { useState, useEffect } from "react";

export default function InstallGuide() {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("install_seen");
    if (!seen) {
      setOpen(true);
    }
  }, []);

  function close() {
    localStorage.setItem("install_seen", "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={box}>

        <h2>📱 アプリとして使う方法</h2>

        <p>① Safariで開く</p>
        <p>② 下の「□↑」を押す</p>
        <p>③ 「ホーム画面に追加」</p>

        <p style={{marginTop:10}}>
          🌙ひそひそがアプリになります
        </p>

        <button style={btn} onClick={close}>
          わかった
        </button>

      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  top:0,
  left:0,
  right:0,
  bottom:0,
  background:"rgba(0,0,0,0.6)",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  zIndex:9999
};

const box: React.CSSProperties = {
  background:"#fff",
  padding:20,
  borderRadius:12,
  textAlign:"center",
  width:"80%",
  maxWidth:320
};

const btn: React.CSSProperties = {
  marginTop:15,
  padding:"10px 20px",
  border:"none",
  borderRadius:8,
  background:"#4f7cff",
  color:"#fff"
};