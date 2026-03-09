import { loadStripe } from "@stripe/stripe-js"
import { useNavigate } from "react-router-dom"
import "./Purchase.css"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export default function SubscriptionPurchase() {

  const navigate = useNavigate()

  async function buy(priceId:string){

    const stripe = await stripePromise

    const res = await fetch("/api/create-checkout",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        priceId
      })
    })

    const data = await res.json()

    await stripe?.redirectToCheckout({
      sessionId:data.id
    })

  }

  return(

    <div className="purchase-page">

      <div className="purchase-title">
        サブスク
      </div>

      <div className="purchase-list">

        <button
          className="purchase-btn"
          onClick={()=>buy(import.meta.env.VITE_STRIPE_SUB_MIDNIGHT)}
        >
          ミッドナイト無制限  
          1200円 / 月
        </button>

        <button
          className="purchase-btn"
          onClick={()=>buy(import.meta.env.VITE_STRIPE_SUB_FULL)}
        >
          24時間無制限  
          1900円 / 月
        </button>

      </div>

      <button
        className="back-btn"
        onClick={()=>navigate(-1)}
      >
        戻る
      </button>

    </div>

  )

}