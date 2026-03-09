import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

export default function Share() {

  const navigate = useNavigate();

  const [refCode,setRefCode] = useState("");
  const [inviteUrl,setInviteUrl] = useState("");

  useEffect(()=>{

    let code = localStorage.getItem("ref_code");

    if(!code){
      code = crypto.randomUUID().slice(0,8);
      localStorage.setItem("ref_code",code);
    }

    setRefCode(code);

    const url = `${window.location.origin}/register?ref=${code}`;

    setInviteUrl(url);

  },[]);

  const copy = async ()=>{

    try{
      await navigator.clipboard.writeText(inviteUrl);
      alert("招待リンクをコピーしました");
    }catch{
      alert("コピーできませんでした");
    }

  };

  const share = async ()=>{

    if((navigator as any).share){

      try{
        await (navigator as any).share({
          title:"ひそひそ",
          text:"このアプリ一緒に使おう",
          url:inviteUrl
        });
      }catch{}

    }else{
      copy();
    }

  };

  return(

    <div style={{padding:20,maxWidth:420,margin:"0 auto"}}>

      <button onClick={()=>navigate(-1)}>
        ← 戻る
      </button>

      <h2 style={{marginTop:20}}>
        友だちを招待
      </h2>

      <p>
        招待するとポイントがもらえます
      </p>

      <div style={{
        display:"flex",
        justifyContent:"center",
        marginTop:20
      }}>
        <QRCodeSVG value={inviteUrl} size={220}/>
      </div>

      <div style={{
        marginTop:20,
        wordBreak:"break-all",
        fontSize:14
      }}>
        {inviteUrl}
      </div>

      <button
        style={{
          marginTop:20,
          width:"100%",
          height:48,
          borderRadius:10
        }}
        onClick={copy}
      >
        リンクをコピー
      </button>

      <button
        style={{
          marginTop:10,
          width:"100%",
          height:48,
          borderRadius:10
        }}
        onClick={share}
      >
        共有する
      </button>

    </div>

  );

}