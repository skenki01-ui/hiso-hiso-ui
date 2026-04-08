import { isDayPassActive } from "../../utils/daypass";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuModal from "../components/MenuModal";
import { supabase } from "../../lib/supabase";
import { generateReply } from "../../services/aiEngine";
import "./Chat.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type BoyId = "teo" | "rei" | "sora";

const TYPE_SPEED = 140;

function sleep(ms:number){
  return new Promise(res=>setTimeout(res,ms))
}

function isNightTime(){
  const h = new Date().getHours()
  return h >= 20 || h < 5
}

function getTurnAllowance(){
  return isNightTime() ? 6 : 3
}

function getWindowStart(){
  const d = new Date()
  const y = d.getFullYear()
  const m = d.getMonth()
  const day = d.getDate()
  const h = d.getHours()

  if(h >= 20) return new Date(y,m,day,20).getTime()
  if(h < 5) return new Date(y,m,day-1,20).getTime()

  return new Date(y,m,day,5).getTime()
}

function loadTurnState(){
  const allowance = getTurnAllowance()
  const start = getWindowStart()

  const savedStart = Number(localStorage.getItem("hs_turn_window_start") || "0")
  const savedRemaining = Number(localStorage.getItem("hs_turn_remaining") || allowance)

  if(savedStart !== start){
    localStorage.setItem("hs_turn_window_start",String(start))
    localStorage.setItem("hs_turn_remaining",String(allowance))
    return allowance
  }

  return savedRemaining
}

function saveRemaining(n:number){
  localStorage.setItem("hs_turn_remaining",String(n))
}

function getNextRecoveryText(){
  return isNightTime() ? "次の回復は 5:00 です" : "次の回復は 20:00 です"
}

export default function BoyChat(){

  const navigate = useNavigate()
  const { id } = useParams()
  const boyId = (id || "") as BoyId

  const userId = localStorage.getItem("user_id") || "guest"

  const [messages,setMessages] = useState<Message[]>([])
  const [input,setInput] = useState("")
  const [menuOpen,setMenuOpen] = useState(false)

  const [remaining,setRemaining] = useState(0)
  const [point,setPoint] = useState(0)
  const [isTyping,setIsTyping] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const boyInfo = useMemo(()=>{
    const map: Record<BoyId,{name:string,img:string}> = {
      teo:{name:"テオ",img:"/boys/teo.png"},
      rei:{name:"レイ",img:"/boys/rei.png"},
      sora:{name:"そら",img:"/boys/sora.png"}
    }
    return map[boyId]
  },[boyId])

  const roomId = `boy_${boyId}_${userId}`

  // 🔥 新サブスク判定
  const subType = localStorage.getItem("hs_sub_type")

  const unlimited =
    subType === "full" ||
    (subType === "night" && isNightTime()) ||
    isDayPassActive()

  useEffect(()=>{
    setRemaining(loadTurnState())

    async function loadPoint(){
      const {data} = await supabase
        .from("users")
        .select("point")
        .eq("id",userId)
        .single()

      if(data) setPoint(data.point || 0)
    }

    loadPoint()
  },[])

  useEffect(()=>{
    async function loadMessages(){
      const {data} = await supabase
        .from("messages")
        .select("*")
        .eq("room_id",roomId)
        .order("created_at",{ascending:true})

      if(data) setMessages(data as Message[])
    }

    if(boyId) loadMessages()
  },[boyId])

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages,isTyping])

  async function typeAssistantMessage(full:string){

    setIsTyping(true)

    const id=crypto.randomUUID()

    setMessages(prev=>[...prev,{id,role:"assistant",content:""}])

    for(let i=0;i<full.length;i++){
      await sleep(TYPE_SPEED)

      setMessages(prev=>
        prev.map(m=>
          m.id===id ? {...m,content:full.slice(0,i+1)} : m
        )
      )
    }

    setIsTyping(false)
  }

  async function sendMessage(){

    const text=input.trim()
    if(!text || isTyping) return

    const currentRemaining = loadTurnState()

    if(unlimited || currentRemaining > 0){

      if(!unlimited){
        const next = currentRemaining - 1
        saveRemaining(next)
        setRemaining(next)
      }

    }else{

      const res = await fetch("/api/use-point",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ user_id:userId, amount:5 })
      })

      const data = await res.json()

      if(!data.success){
        setMessages(prev=>[
          ...prev,
          {
            id:crypto.randomUUID(),
            role:"assistant",
            content:`無料ターンを使い切りました\n${getNextRecoveryText()}\nまたは5pで続けられます`
          }
        ])
        return
      }

      setPoint(data.point)
    }

    setInput("")

    const {data:userData} = await supabase
      .from("messages")
      .insert([{ room_id:roomId,user_id:userId,role:"user",content:text }])
      .select()
      .single()

    if(!userData) return

    setMessages(prev=>[...prev,userData as Message])

    const aiText = await generateReply({
      character: boyInfo?.name,
      genre:"boy",
      userMessage:text
    })

    await typeAssistantMessage(aiText)

    await supabase.from("messages").insert([
      { room_id:roomId,user_id:userId,role:"assistant",content:aiText }
    ])
  }

  return(
    <div className="chat-page">

      <div className="chat-header">

        <button className="header-btn" onClick={()=>navigate("/select/boy")}>
          ◀︎
        </button>

        <div className="chat-title">
          <img src={boyInfo?.img} className="header-avatar"/>
          <span className="header-name">{boyInfo?.name}</span>
        </div>

        <div className="header-right">
          <span className="header-remaining">
            {unlimited ? "残り ♾️" : `残り ${remaining}`} | {point}p
          </span>

          <button className="header-btn" onClick={()=>setMenuOpen(true)}>
            三
          </button>
        </div>

      </div>

      <div className="chat-list">

        {messages.map(m=>
          m.role==="assistant"
          ?(
            <div key={m.id} className="row ai">
              <img src={boyInfo?.img} className="avatar"/>
              <div className="bubble ai">{m.content}</div>
            </div>
          )
          :(
            <div key={m.id} className="row me">
              <div className="bubble me">{m.content}</div>
            </div>
          )
        )}

        <div ref={bottomRef}/>

      </div>

      <div className="chat-footer">

        <input
          className="chat-input"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>e.key==="Enter" && sendMessage()}
        />

        <button className="chat-send" onClick={sendMessage}>
          送信
        </button>

      </div>

      <MenuModal open={menuOpen} onClose={()=>setMenuOpen(false)}/>

    </div>
  )
}