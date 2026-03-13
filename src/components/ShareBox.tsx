import { QRCodeSVG } from "qrcode.react";

const url = "https://hisohiso.vercel.app";

export default function ShareBox(){

  const copy = async ()=>{
    await navigator.clipboard.writeText(url);
    alert("URLコピーしました");
  };

  return(

    <div style={{marginTop:40,textAlign:"center"}}>

      <div style={{fontSize:14,marginBottom:10}}>
        このアプリを教える
      </div>

      <QRCodeSVG value={url} size={130} />

      <div style={{marginTop:10,fontSize:13}}>
        {url}
      </div>

      <button
        onClick={copy}
        style={{
          marginTop:8,
          padding:"6px 12px",
          borderRadius:6,
          border:"none",
          background:"#4a6cf7",
          color:"#fff"
        }}
      >
        URLコピー
      </button>

    </div>

  );
}