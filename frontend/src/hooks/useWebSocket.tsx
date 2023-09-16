import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

interface MessageData {
  message: string,
  isAutomated: boolean
}

export default function useWebSocket() {
  const navigate = useNavigate()
  const ws = useRef<WebSocket>()
  const [messages, setMessages] = useState<MessageData[]>()

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:6969`)
    ws.current.onopen = () => { console.log("socket opened") }
    ws.current.onclose = (ev) => {
      console.log(ev.code)
      if (ev.code === 4001) {
        navigate("/login")
      }
      console.log("socket closed")
    }
    ws.current.onmessage = (ev: MessageEvent<string>) => {
      const data: MessageData = JSON.parse(ev.data)
      setMessages(prev => [...prev ?? [], data])
    }
    return () => {
      ws.current?.close()
    }
  }, [])



  return {
    ws: ws.current,
    messages
  }
}
